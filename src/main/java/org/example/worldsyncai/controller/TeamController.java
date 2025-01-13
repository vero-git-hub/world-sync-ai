package org.example.worldsyncai.controller;

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

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@Slf4j
public class TeamController {

    @Value("${mlb.team.url}")
    private String teamUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Fetches the details of a specific team by its ID.
     *
     * @param teamId the ID of the team
     * @return the team's details
     */
    @GetMapping("/mlb/team/{teamId}")
    public ResponseEntity<?> getTeamDetails(@PathVariable int teamId) {
        String url = teamUrl + "/" + teamId + "/roster?season=2025";

        try {
            log.info("Fetching details for team ID: {}", teamId);
            String response = restTemplate.getForObject(url, String.class);
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
}