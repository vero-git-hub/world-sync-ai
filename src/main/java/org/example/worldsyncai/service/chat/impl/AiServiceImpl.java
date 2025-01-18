package org.example.worldsyncai.service.chat.impl;

import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.AiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.Scanner;

/**
 * Gemini AI service.
 * Interaction with Gemini AI (Vertex AI) in Google Cloud.
 * Authentication, model queries and response retrieval.
 */
@Service
@Slf4j
public class AiServiceImpl implements AiService {

    @Value("${google.cloud.project-id}")
    private String projectId;

    @Value("${google.cloud.location}")
    private String location;

    @Value("${google.cloud.model-name}")
    private String modelName;

    @Value("${google.cloud.gemini.max-tokens}")
    private int maxTokens;

    @Value("${google.cloud.gemini.temperature}")
    private float temperature;

    @Value("${google.cloud.credentials}")
    private String credentialsPath;

    private AccessToken accessToken;

    @PostConstruct
    public void initialize() {
        init();
    }

    /**
     * Initializing authentication.
     */
    public void init() {
        System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", credentialsPath);
        refreshAccessToken();
    }

    /**
     * Get a new Access Token from a service account.
     */
    private void refreshAccessToken() {
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath))
                    .createScoped("https://www.googleapis.com/auth/cloud-platform");
            credentials.refreshIfExpired();
            accessToken = credentials.getAccessToken();
        } catch (Exception e) {
            log.error("Error getting Access Token.", e);
        }
    }

    @Override
    public String getAIResponse(String prompt) {
        try {
            if (accessToken == null || accessToken.getExpirationTime().before(new Date())) {
                refreshAccessToken();
            }

            String endpoint = String.format(
                    "https://us-central1-aiplatform.googleapis.com/v1/projects/%s/locations/%s/publishers/google/models/%s:streamGenerateContent",
                    projectId, location, modelName
            );

            JsonObject requestBody = new JsonObject();
            JsonArray contentsArray = new JsonArray();
            JsonObject contentObject = new JsonObject();
            contentObject.addProperty("role", "user");

            JsonArray partsArray = new JsonArray();
            JsonObject textPart = new JsonObject();
            textPart.addProperty("text", prompt);
            partsArray.add(textPart);

            contentObject.add("parts", partsArray);
            contentsArray.add(contentObject);

            requestBody.add("contents", contentsArray);

            URL url = new URL(endpoint);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Authorization", "Bearer " + accessToken.getTokenValue());
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);

            try (OutputStream os = connection.getOutputStream()) {
                byte[] input = requestBody.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            String response;
            try (Scanner scanner = new Scanner(connection.getInputStream(), "utf-8")) {
                response = scanner.useDelimiter("\\A").next();
            }

//            log.info("Full AI Response: {}", response);

            JsonArray jsonArray = JsonParser.parseString(response).getAsJsonArray();
            StringBuilder fullResponse = new StringBuilder();

            for (JsonElement element : jsonArray) {
                JsonObject jsonResponse = element.getAsJsonObject();
                JsonArray candidates = jsonResponse.getAsJsonArray("candidates");

                for (JsonElement candidateElement : candidates) {
                    JsonObject candidateObj = candidateElement.getAsJsonObject();
                    JsonObject content = candidateObj.getAsJsonObject("content");
                    JsonArray parts = content.getAsJsonArray("parts");

                    for (JsonElement partElement : parts) {
                        fullResponse.append(partElement.getAsJsonObject().get("text").getAsString()).append(" ");
                    }
                }
            }

            return fullResponse.toString().trim();

        } catch (Exception e) {
            log.error("Error calling AI model.", e);
            return "Error processing AI request.";
        }
    }
}