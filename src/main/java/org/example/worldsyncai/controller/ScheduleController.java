package org.example.worldsyncai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Slf4j
public class ScheduleController {

    @Value("${mlb.schedule.url}")
    private String scheduleUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Gets the MLB schedule from the external API.
     *
     * @return the response entity containing the schedule or an error message
     */
    @GetMapping("/mlb")
    public ResponseEntity<?> getMlbSchedule() {
        int maxRetries = 3;
        int retryCount = 0;
        int waitTime = 3000;

        while (retryCount < maxRetries) {
            try {
                String response = restTemplate.getForObject(scheduleUrl, String.class);
                return ResponseEntity.ok()
                        .header("Content-Type", "application/json")
                        .body(response);
            } catch (HttpClientErrorException e) {
                log.error("Client error: {} - {}", e.getStatusCode(), e.getMessage());
                return ResponseEntity.status(e.getStatusCode())
                        .body("Client error: " + e.getMessage());
            } catch (ResourceAccessException e) {
                log.warn("Timeout error: Unable to connect to MLB Stats API. Retrying in {} ms...", waitTime);
                retryCount++;
                try {
                    Thread.sleep(waitTime);
                } catch (InterruptedException interruptedException) {
                    Thread.currentThread().interrupt();
                    log.error("Interrupted during retry: {}", interruptedException.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Interrupted during retry process.");
                }
            } catch (Exception e) {
                log.error("Unexpected error: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Unexpected error: " + e.getMessage());
            }
        }

        log.error("Max retries reached. Unable to fetch MLB schedule.");
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body("Service is currently unavailable. Please try again later.");
    }
}