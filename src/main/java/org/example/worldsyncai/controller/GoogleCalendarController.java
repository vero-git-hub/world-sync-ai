package org.example.worldsyncai.controller;

import com.google.api.services.calendar.model.EventDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.calendar.EventRequestDto;
import org.example.worldsyncai.dto.calendar.GameEventDto;
import org.example.worldsyncai.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.example.worldsyncai.service.GoogleCalendarService;
import com.google.api.services.calendar.model.Event;

import java.net.URI;

@RestController
@RequestMapping("/api/google/calendar")
@RequiredArgsConstructor
@Slf4j
public class GoogleCalendarController {

    private final GoogleCalendarService googleCalendarService;

    private final UserService userService;

    @Value("${google.oauth2.client-id}")
    private String clientId;

    @Value("${google.oauth2.client-secret}")
    private String clientSecret;

    @Value("${google.oauth2.redirect-uri}")
    private String redirectUri;

    @GetMapping("/auth")
    public ResponseEntity<Void> redirectToGoogleAuth() {
        String authUrl = String.format(
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=%s",
                clientId, redirectUri, "https://www.googleapis.com/auth/calendar.events"
        );
        return ResponseEntity.status(302).location(URI.create(authUrl)).build();
    }

    @GetMapping("/callback")
    public ResponseEntity<String> handleGoogleCallback(@RequestParam("code") String code) {
        try {
            String accessToken = googleCalendarService.exchangeCodeForTokens(
                    code, clientId, clientSecret, redirectUri
            );

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No user is authenticated.");
            }
            String currentUsername = authentication.getName();


            var userDtoOpt = userService.getUserByUsername(currentUsername);
            if (userDtoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found in DB.");
            }
            Long userId = userDtoOpt.get().getId();

            userService.updateUserCalendarToken(userId, accessToken);

            return ResponseEntity.ok("Google Calendar connected successfully!");
        } catch (Exception e) {
            log.error("Error during Google OAuth callback", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to connect Google Calendar.");
        }
    }

    @PostMapping("/event")
    public ResponseEntity<String> createEvent(
            @RequestBody EventRequestDto dto,
            @RequestHeader("Authorization") String accessToken
    ) {
        try {
            Event event = new Event()
                    .setSummary(dto.summary())
                    .setDescription(dto.description())
                    .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.start().dateTime())))
                    .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.end().dateTime())));

            googleCalendarService.createEvent(accessToken, event);
            return ResponseEntity.ok("Event created successfully!");
        } catch (Exception e) {
            log.error("Error creating event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create event.");
        }
    }

    @PostMapping("/event/game")
    public ResponseEntity<String> createGameEvent(@RequestBody GameEventDto dto) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("No user is authenticated.");
            }
            String username = auth.getName();

            var userDtoOpt = userService.getUserByUsername(username);
            if (userDtoOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            String accessToken = userService.getUserCalendarToken(userDtoOpt.get().getId());

            if (accessToken == null || accessToken.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("User does not have a Google Calendar token.");
            }

            Event event = new Event()
                    .setSummary(dto.summary())
                    .setDescription(dto.description())
                    .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.startDateTime())))
                    .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(dto.endDateTime())));

            googleCalendarService.createEvent(accessToken, event);

            return ResponseEntity.ok("Game event created successfully in Google Calendar!");
        } catch (Exception e) {
            log.error("Error creating game event", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create game event.");
        }
    }
}