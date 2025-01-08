package org.example.worldsyncai.controller;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    private final RestTemplate restTemplate;

    public ScheduleController(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    @GetMapping("/local")
    public ResponseEntity<?> getLocalSchedule() {
        try {
            Path filePath = Paths.get("src/main/resources/schedule.json");
            String content = Files.readString(filePath);
            return ResponseEntity.ok(content);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file: " + e.getMessage());
        }
    }

    @GetMapping("/mlb")
    public ResponseEntity<?> getMlbSchedule() {
        String url = "https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024&gameType=R";
        try {
            String response = restTemplate.getForObject(url, String.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching data from MLB Stats API: " + e.getMessage());
        }
    }
}