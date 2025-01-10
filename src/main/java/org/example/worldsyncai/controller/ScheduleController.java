package org.example.worldsyncai.controller;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final RestTemplate restTemplate;

    public ScheduleController(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(5))
                .build();
    }

    @GetMapping("/mlb")
    public ResponseEntity<?> getMlbSchedule() {
        String url = "https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2025&gameType=R";
        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(response);
        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body("Client error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data from MLB Stats API: " + e.getMessage());
        }
    }
}