package org.example.worldsyncai.controller;

import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.json.GoogleJsonResponseException;
import com.google.api.services.calendar.model.EventDateTime;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.auth.JwtTokenProvider;
import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.dto.calendar.EventRequestDto;
import org.example.worldsyncai.dto.calendar.GameEventDto;
import org.example.worldsyncai.model.User;
import org.example.worldsyncai.service.UserService;
import org.example.worldsyncai.service.impl.SecretManagerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.example.worldsyncai.service.GoogleCalendarService;
import com.google.api.services.calendar.model.Event;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@RestController
@RequestMapping("/api/google/calendar")
@Slf4j
public class GoogleCalendarController {

    private final GoogleCalendarService googleCalendarService;

    private final UserService userService;

    private final JwtTokenProvider jwtTokenProvider;

    private final String clientId;

    private final String clientSecret;

    private final String redirectUri;

    private final String frontendUrl;

    public GoogleCalendarController(GoogleCalendarService googleCalendarService,
                                    UserService userService,
                                    JwtTokenProvider jwtTokenProvider,
                                    SecretManagerService secretManagerService) {
        this.googleCalendarService = googleCalendarService;
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.clientId = secretManagerService.getGoogleOAuthClientId();
        this.clientSecret = secretManagerService.getGoogleOAuthClientSecret();
        this.redirectUri = secretManagerService.getGoogleOAuthRedirectUri();
        this.frontendUrl = secretManagerService.getSecret("frontend-url");
    }

    @GetMapping("/auth")
    public ResponseEntity<Void> redirectToGoogleAuth(@RequestParam("auth") String token) {
        if (token == null || token.isBlank() || !jwtTokenProvider.validateToken(token)) {
            log.error("❌ Invalid or missing JWT token in Google OAuth request.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentUsername = jwtTokenProvider.getUsernameFromToken(token);

        String authUrl = UriComponentsBuilder.fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "https://www.googleapis.com/auth/calendar.events")
                .queryParam("state", currentUsername)
                .encode()
                .toUriString();

        return ResponseEntity.status(302).location(URI.create(authUrl)).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<Void> handleGoogleCallback(@RequestParam("code") String code, @RequestParam("state") String username) {
        if (username == null || username.isBlank() || "anonymousUser".equals(username)) {
            log.error("❌ Invalid or missing username in OAuth callback.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            TokenResponse tokenPair = googleCalendarService.exchangeCodeForTokens(
                    code, clientId, clientSecret, redirectUri
            );

            String accessToken = tokenPair.getAccessToken();
            String refreshToken = tokenPair.getRefreshToken();

            Optional<UserDto> userDtoOpt = userService.getUserByUsername(username);
            if (userDtoOpt.isEmpty()) {
                log.error("❌ No user found in DB for username: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Long userId = userDtoOpt.get().getId();

            log.info("✅ Storing tokens for user {}: AccessToken: {}, RefreshToken: {}", username, accessToken, refreshToken);
            userService.updateUserCalendarTokens(userId, accessToken, refreshToken);

            URI redirectUri = URI.create(frontendUrl + "/profile");
            return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
        } catch (Exception e) {
            log.error("❌ Error during Google OAuth callback", e);
            URI redirectUri = URI.create(frontendUrl + "/profile?error=google_auth_failed");
            return ResponseEntity.status(HttpStatus.FOUND).location(redirectUri).build();
        }
    }

    @PostMapping("/event")
    public ResponseEntity<String> createEvent(
            @RequestBody EventRequestDto dto,
            @RequestHeader("Authorization") String accessTokenHeader
    ) {
        try {
            final String prefix = "Bearer ";
            String accessToken = accessTokenHeader.startsWith(prefix)
                    ? accessTokenHeader.substring(prefix.length())
                    : accessTokenHeader;

            Event event = new Event()
                    .setSummary(dto.summary())
                    .setDescription(dto.description())
                    .setStart(new EventDateTime().setDateTime(
                            new com.google.api.client.util.DateTime(dto.start().dateTime())))
                    .setEnd(new EventDateTime().setDateTime(
                            new com.google.api.client.util.DateTime(dto.end().dateTime())));

            googleCalendarService.createEvent(accessToken, event);
            return ResponseEntity.ok("Event created successfully!");

        } catch (GoogleJsonResponseException gjre) {
            if (gjre.getStatusCode() == 401) {
                log.warn("Access token is invalid or expired, let's try refresh...");

                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication == null || !authentication.isAuthenticated()) {
                    log.error("No user is authenticated, can't refresh token.");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user is authenticated");
                }

                String username = authentication.getName();

                Optional<UserDto> userDtoOpt = userService.getUserByUsername(username);
                if (userDtoOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
                }
                Long userId = userDtoOpt.get().getId();


                Optional<User> userEntityOpt = userService.findUserEntityById(userId);
                if (userEntityOpt.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User entity not found.");
                }
                User userEntity = userEntityOpt.get();
                String refreshToken = userEntity.getGoogleCalendarRefreshToken();
                if (refreshToken == null || refreshToken.isEmpty()) {
                    log.error("No refresh token in DB; user must re-connect Google.");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token not found.");
                }

                try {
                    var newTokens = googleCalendarService.refreshAccessToken(
                            refreshToken, clientId, clientSecret
                    );
                    String newAccessToken = newTokens.getAccessToken();

                    userService.updateUserCalendarTokens(userId, newAccessToken, refreshToken);

                    Event eventRetry = new Event()
                            .setSummary(dto.summary())
                            .setDescription(dto.description())
                            .setStart(new EventDateTime().setDateTime(
                                    new com.google.api.client.util.DateTime(dto.start().dateTime())))
                            .setEnd(new EventDateTime().setDateTime(
                                    new com.google.api.client.util.DateTime(dto.end().dateTime())));

                    googleCalendarService.createEvent(newAccessToken, eventRetry);

                    return ResponseEntity.ok("Event created successfully (after refresh)!");
                } catch (Exception ex) {
                    log.error("Refresh token flow failed", ex);
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body("Failed to refresh token, user re-connect needed.");
                }

            } else {
                log.error("Google API returned an error", gjre);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Failed to create event (API error).");
            }

        } catch (Exception e) {
            log.error("Error creating event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create event.");
        }
    }

    @PostMapping("/event/game")
    public ResponseEntity<String> createGameEvent(
            @RequestBody GameEventDto dto,
            @RequestHeader("Authorization") String accessTokenHeader
    ) {
        try {
            final String prefix = "Bearer ";
            if (!accessTokenHeader.startsWith(prefix)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Authorization header.");
            }

            String jwtToken = accessTokenHeader.substring(prefix.length());
            if (!jwtTokenProvider.validateToken(jwtToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired JWT token.");
            }

            String username = jwtTokenProvider.getUsernameFromToken(jwtToken);

            Optional<UserDto> userDtoOpt = userService.getUserByUsername(username);
            if (userDtoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            Long userId = userDtoOpt.get().getId();
            String googleAccessToken = userService.getUserCalendarToken(userId);

            if (googleAccessToken == null || googleAccessToken.isBlank()) {
                log.error("❌ User '{}' does not have a Google Calendar token.", username);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have a Google Calendar token.");
            }

            Event event = new Event()
                    .setSummary(dto.summary())
                    .setDescription(dto.description())
                    .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.startDateTime())))
                    .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.endDateTime())));

            googleCalendarService.createEvent(googleAccessToken, event);

            return ResponseEntity.ok("Game event created successfully in Google Calendar!");
        } catch (GoogleJsonResponseException gjre) {
            log.error("Google API error: {}", gjre.getDetails());

            if (gjre.getStatusCode() == 401) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google access token expired.");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Google Calendar API error.");
        } catch (Exception e) {
            log.error("❗ Error creating game event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create game event.");
        }
    }

    @GetMapping("/check")
    public ResponseEntity<String> checkToken() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user is authenticated");
            }
            String username = auth.getName();

            var userDtoOpt = userService.getUserByUsername(username);
            if (userDtoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
            Long userId = userDtoOpt.get().getId();

            String accessToken = userService.getUserCalendarToken(userId);
            if (accessToken == null || accessToken.isBlank()) {
                return ResponseEntity.ok("no_token");
            }

            try {
                var service = googleCalendarService.getCalendarService(accessToken);
                service.events().list("primary").setMaxResults(1).execute();
                return ResponseEntity.ok("valid");
            } catch (GoogleJsonResponseException gjre) {
                if (gjre.getStatusCode() == 401) {
                    log.warn("📌 Google Calendar token expired for user: {}", username);
                    return ResponseEntity.ok("expired");
                }
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Calendar error");
            }
        } catch (Exception e) {
            log.error("❗ Error checking Google Calendar token", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Check token error");
        }
    }
}