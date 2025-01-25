package org.example.worldsyncai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
     * Retrieves detailed information about an MLB team based on its unique team ID.
     * The data includes general team information and the roster for the 2025 season.
     *
     * <p>If the data for the specified team is already cached, it will return directly
     * from the cache to speed up the response.</p>
     *
     * <p>API calls are made to fetch the team data and roster if not cached. The
     * responses are parsed and stored in the cache for future use.</p>
     *
     * @param teamId The unique identifier for the MLB team whose details need to be retrieved.
     * @return A {@link ResponseEntity} containing HTTP statuses: 200, 408 (REQUEST_TIMEOUT), 4xx or 5xx, 500
     */
    @GetMapping("/mlb/team/{teamId}")
    public ResponseEntity<?> getTeamDetails(@PathVariable int teamId) {
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
     * Retrieves a list of all MLB teams by calling an external API.
     * The response is returned as a JSON string with the appropriate Content-Type header.
     *
     * @return A {@link ResponseEntity} containing the list of teams in JSON format
     * if the request is successful, or an appropriate HTTP status code if an error occurs.
     * Possible HTTP status responses:
     * - 200 OK: Successfully retrieved the list of teams.
     * - 4xx: Client-related errors, such as bad requests or unauthorized access.
     * - 500 INTERNAL_SERVER_ERROR: Unexpected errors on the server side.
     */
    @GetMapping("/mlb/teams")
    public ResponseEntity<?> getAllTeams() {
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