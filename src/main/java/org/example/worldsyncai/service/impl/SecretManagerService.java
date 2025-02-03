package org.example.worldsyncai.service.impl;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.secretmanager.v1.*;
import com.google.cloud.spring.secretmanager.SecretManagerTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class SecretManagerService {

    @Value("${google.cloud.project-id}")
    private String projectId;

    private final SecretManagerTemplate secretManagerTemplate;

    public SecretManagerService(SecretManagerTemplate secretManagerTemplate) {
        this.secretManagerTemplate = secretManagerTemplate;
    }

    public String getSecret(String secretId) {
        try {
            GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();

            if (credentials instanceof ServiceAccountCredentials) {
                String serviceAccountEmail = ((ServiceAccountCredentials) credentials).getClientEmail();
                log.info("🔍 Authenticated service account: {}", serviceAccountEmail);
            } else {
                log.warn("⚠️ Not a service account being used!");
            }

            try (SecretManagerServiceClient client = SecretManagerServiceClient.create()) {
                String secretName = String.format("projects/%s/secrets/%s/versions/latest", projectId, secretId);
                AccessSecretVersionResponse response = client.accessSecretVersion(secretName);
                return response.getPayload().getData().toStringUtf8();
            }

        } catch (IOException e) {
            log.error("❌ I/O error when accessing Secret Manager: ", e);
            throw new RuntimeException("Error getting secret " + secretId, e);
        } catch (Exception e) {
            log.error("❌ General error when accessing Secret Manager: ", e);
            throw new RuntimeException("Error getting secret " + secretId, e);
        }
    }

    public String getGeminiApiKey() {
        String apiKey = secretManagerTemplate.getSecretString("gemini-api-key");
        log.info("🔍 Obtained API key from Secret Manager: {}", apiKey);
        return apiKey;
    }
}