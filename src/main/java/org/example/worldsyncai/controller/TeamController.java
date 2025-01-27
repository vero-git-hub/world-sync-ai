package org.example.worldsyncai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.auth.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;

import javax.annotation.PostConstruct;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController {

    @Value("${mlb.team.url}")
    private String teamUrl;

    @Value("${mlb.teams.url}")
    private String teamsUrl;

    @Value("${mlb.team.logo}")
    private String teamLogo;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final JwtTokenProvider jwtTokenProvider;

    private final Map<Integer, byte[]> teamLogoCache = new ConcurrentHashMap<>();
    private final Map<Integer, Map<String, Object>> teamDataCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void initRestTemplate() {
        restTemplate.setRequestFactory(new RestTemplateBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(5))
                .build()
                .getRequestFactory());
    }

    /**
     * Retrieves the details of a specified MLB team, including team information and roster for a given season.
     *
     * @param teamId the unique identifier of the MLB team whose details are to be fetched
     * @param authHeader the authorization header containing the Bearer JWT token for authentication
     * @return a ResponseEntity containing the team details if the request is successful, or an appropriate error response
     *         with the corresponding HTTP status code if an error occurs
     */
    @GetMapping("/mlb/team/{teamId}")
    public ResponseEntity<?> getTeamDetails(@PathVariable int teamId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("❌ No valid JWT token provided.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header.");
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            log.error("❌ Invalid or expired JWT token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired JWT token.");
        }

        if (teamDataCache.containsKey(teamId)) {
            log.debug("✅ Returning cached data for team {}", teamId);
            return ResponseEntity.ok(teamDataCache.get(teamId));
        }

        String teamInfoUrl = teamUrl + "/" + teamId;
        String rosterUrl = teamUrl + "/" + teamId + "/roster?season=2025";

        try {
            String teamInfoResponse = restTemplate.getForObject(teamInfoUrl, String.class);
            String rosterResponse = restTemplate.getForObject(rosterUrl, String.class);

            Map<String, Object> response = new HashMap<>();
            response.put("teamInfo", objectMapper.readValue(teamInfoResponse, Map.class));
            response.put("roster", objectMapper.readValue(rosterResponse, Map.class).get("roster"));

            teamDataCache.put(teamId, response);

            return ResponseEntity.ok(response);
        } catch (HttpClientErrorException e) {
            log.error("❌ Client error while fetching details for team {}: {} - {}", teamId, e.getStatusCode(), e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body("Client error: " + e.getMessage());
        } catch (ResourceAccessException e) {
            log.error("⏳ Timeout while fetching details for team {}", teamId);
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Request timed out. Please try again.");
        } catch (Exception e) {
            log.error("❗ Unexpected error while fetching details for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Fetches a list of MLB teams from a remote service.
     *
     * @param authHeader The Authorization header containing a Bearer JWT token to authenticate the request.
     * @return A ResponseEntity containing the list of MLB teams in JSON format if the request is successful,
     *         or an error message with the corresponding HTTP status code if the request fails.
     */
    @GetMapping("/mlb/teams")
    public ResponseEntity<?> getAllTeams(@RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("❌ No valid JWT token provided.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header.");
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            log.error("❌ Invalid or expired JWT token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired JWT token.");
        }

        try {
            String response = restTemplate.getForObject(teamsUrl, String.class);
            return ResponseEntity.ok().header("Content-Type", "application/json").body(response);
        } catch (HttpClientErrorException e) {
            log.error("❌ Client error while fetching teams: {}", e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body("Client error: " + e.getMessage());
        } catch (Exception e) {
            log.error("❗ Server error while fetching teams: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching teams: " + e.getMessage());
        }
    }
    
    /**
     * Retrieves the logo for an MLB team by its ID. If the logo has been previously fetched,
     * it is returned from the cache. Otherwise, the method fetches it from the external URL.
     *
     * @param teamId The unique identifier for the MLB team.
     * @return A {@link ResponseEntity} containing the team logo as a byte array with an
     * "image/svg+xml" content type if successful, or an appropriate HTTP status
     * code if an error occurs (e.g., 404 if the logo is not found).
     */
    @GetMapping("/mlb/team/{teamId}/logo")
    public ResponseEntity<byte[]> getTeamLogo(@PathVariable int teamId) {
        if (teamLogoCache.containsKey(teamId)) {
            log.debug("✅ Returning cached logo for team {}", teamId);
            return ResponseEntity.ok().header("Content-Type", "image/svg+xml").body(teamLogoCache.get(teamId));
        }

        String logoUrl = teamLogo + "/" + teamId + ".svg";

        try {
            byte[] logoBytes = restTemplate.getForObject(logoUrl, byte[].class);
            if (logoBytes != null) {
                teamLogoCache.put(teamId, logoBytes);
                log.debug("🆕 Logo for team {} downloaded and cached", teamId);
                return ResponseEntity.ok().header("Content-Type", "image/svg+xml").body(logoBytes);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (HttpClientErrorException.NotFound e) {
            log.error("❌ Logo for team {} not found", teamId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("❗ Error fetching logo for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}