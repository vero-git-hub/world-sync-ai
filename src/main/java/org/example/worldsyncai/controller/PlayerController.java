package org.example.worldsyncai.controller;

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

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
@Slf4j
public class PlayerController {

    @Value("${mlb.api.base.url}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Fetches the details of a specific player by their ID.
     *
     * @param playerId the ID of the player
     * @return the player's details
     */
    @GetMapping("/{playerId}")
    public ResponseEntity<?> getPlayerDetails(@PathVariable int playerId, @RequestHeader(HttpHeaders.AUTHORIZATION) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.error("❌ No valid JWT token provided.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing or invalid Authorization header.");
        }

        String token = authHeader.substring(7);
        if (!jwtTokenProvider.validateToken(token)) {
            log.error("❌ Invalid or expired JWT token.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired JWT token.");
        }

        String url = baseUrl + "/people/" + playerId;

        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok().header("Content-Type", "application/json").body(response);
        } catch (HttpClientErrorException e) {
            log.error("Client error while fetching details for player ID {}: {} - {}", playerId, e.getStatusCode(), e.getMessage());
            return ResponseEntity.status(e.getStatusCode()).body("Client error: " + e.getMessage());
        } catch (ResourceAccessException e) {
            log.error("Timeout while fetching details for player ID: {}", playerId);
            return ResponseEntity.status(HttpStatus.REQUEST_TIMEOUT).body("Request timed out. Please try again.");
        } catch (Exception e) {
            log.error("Unexpected error while fetching details for player ID {}: {}", playerId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
}