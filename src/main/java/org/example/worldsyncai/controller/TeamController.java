package org.example.worldsyncai.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

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

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Fetches the details and roster of a specific team by its ID.
     *
     * @param teamId the ID of the team
     * @return the team's details and roster
     */
    @GetMapping("/mlb/team/{teamId}")
    public ResponseEntity<?> getTeamDetails(@PathVariable int teamId) {
        String teamInfoUrl = teamUrl + "/" + teamId;
        String rosterUrl = teamUrl + "/" + teamId + "/roster?season=2025";

        try {
            String teamInfoResponse = restTemplate.getForObject(teamInfoUrl, String.class);
            String rosterResponse = restTemplate.getForObject(rosterUrl, String.class);

            Map<String, Object> response = new HashMap<>();
            response.put("teamInfo", new ObjectMapper().readValue(teamInfoResponse, Map.class));
            response.put("roster", new ObjectMapper().readValue(rosterResponse, Map.class).get("roster"));

            return ResponseEntity.ok().header("Content-Type", "application/json").body(response);
        } catch (HttpClientErrorException e) {
            log.error("Client error while fetching details for team ID {}: {} - {}", teamId, e.getStatusCode(), e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body("Client error: " + e.getMessage());
        } catch (ResourceAccessException e) {
            log.error("Timeout while fetching details for team ID: {}", teamId);
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Request timed out. Please try again.");
        } catch (Exception e) {
            log.error("Unexpected error while fetching details for team ID {}: {}", teamId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    /**
     * Fetches the MLB teams from the external API.
     *
     * @return the response entity containing the teams or an error message
     */
    @GetMapping("/mlb/teams")
    public ResponseEntity<?> getAllTeams() {
        try {
            String response = restTemplate.getForObject(teamsUrl, String.class);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Client error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data from GitHub: " + e.getMessage());
        }
    }

    /**
     * Fetches the logo of a specific team by its teamId.
     *
     * @param teamId the ID of the team
     * @return the logo URL or an error message
     */
    @GetMapping("/mlb/team/{teamId}/logo")
    public ResponseEntity<?> getTeamLogo(@PathVariable int teamId) {
        String logoUrl = teamLogo + "/" + teamId + ".svg";

        try {
            byte[] logoBytes = restTemplate.getForObject(logoUrl, byte[].class);

            return ResponseEntity
                    .ok()
                    .header("Content-Type", "image/svg+xml")
                    .body(logoBytes);
        } catch (Exception e) {
            log.error("Error fetching logo for team {}: {}", teamId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}