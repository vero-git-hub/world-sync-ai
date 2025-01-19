package org.example.worldsyncai.service.chat.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.NLPService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class NLPServiceImpl implements NLPService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String detectIntent(String message) {
        try {
            String requestBody = "{ " +
                    "\"contents\": [{ \"parts\": [{ \"text\": \"Classify this user question: '" + message +
                    "' into one of the intents: TEAM_SCHEDULE, GENERAL_QUESTION\" }]}], " +
                    "\"generationConfig\": { \"maxOutputTokens\": 10 } }";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            String url = geminiApiUrl + "?key=" + apiKey;

            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            return parseIntent(response.getBody());

        } catch (Exception e) {
            log.error("❌ Error calling Gemini API", e);
            return "GENERAL_QUESTION";
        }
    }

    private String parseIntent(String response) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            JsonNode jsonNode = objectMapper.readTree(response);

            if (!jsonNode.has("candidates") || jsonNode.get("candidates").isEmpty()) {
                log.warn("⚠️ No candidates found in Gemini response.");
                return "GENERAL_QUESTION";
            }

            JsonNode partsNode = jsonNode.get("candidates").get(0).get("content").get("parts");
            if (partsNode == null || partsNode.isEmpty()) {
                log.warn("⚠️ No parts found in candidate content.");
                return "GENERAL_QUESTION";
            }

            String intent = partsNode.get(0).get("text").asText().trim().toUpperCase();

            if (!intent.isEmpty()) {
                log.info("✅ Successfully parsed intent: {}", intent);
                return intent;
            }

            log.warn("⚠️ Intent detected but empty.");
            return "GENERAL_QUESTION";

        } catch (Exception e) {
            log.error("❌ Error parsing Gemini response", e);
            return "GENERAL_QUESTION";
        }
    }
}