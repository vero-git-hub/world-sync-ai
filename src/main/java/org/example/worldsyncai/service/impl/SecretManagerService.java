package org.example.worldsyncai.service.impl;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.secretmanager.v1.*;
import com.google.cloud.spring.secretmanager.SecretManagerTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class SecretManagerService {

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
                String secretName = String.format("projects/%s/secrets/%s/versions/latest", getGoogleCloudProjectId(), secretId);
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

    public String getCloudSqlClientKey() {
        String cloudSqlKey = secretManagerTemplate.getSecretString("cloud-sql-client-key");
        log.info("🔍 Obtained Cloud SQL Client Key from Secret Manager");
        return cloudSqlKey;
    }

    public String getGoogleCloudProjectId() {
        String projectId = secretManagerTemplate.getSecretString("google-cloud-project-id");
        log.info("🔍 Obtained Project ID from Secret Manager: {}", projectId);
        return projectId.trim();
    }

    public String getGoogleOAuthClientId() {
        String clientId = secretManagerTemplate.getSecretString("google-oauth-client-id");
        log.info("🔍 Obtained Google OAuth Client ID from Secret Manager: {}", clientId);
        return clientId.trim();
    }

    public String getGoogleOAuthClientSecret() {
        String clientSecret = secretManagerTemplate.getSecretString("google-oauth-client-secret");
        log.info("🔍 Obtained Google OAuth Client Secret from Secret Manager: {}", clientSecret);
        return clientSecret.trim();
    }

    public String getDatabaseName() {
        String dbName = secretManagerTemplate.getSecretString("DB_NAME");
        log.info("🔍 Obtained DB Name from Secret Manager: {}", dbName);
        return dbName != null ? dbName.trim() : null;
    }

    public String getDatabaseInstance() {
        String dbInstance = secretManagerTemplate.getSecretString("DB_INSTANCE");
        log.info("🔍 Obtained DB Instance from Secret Manager: {}", dbInstance);
        return dbInstance.trim();
    }

    public String getDatabaseUser() {
        String dbUser = secretManagerTemplate.getSecretString("DB_USER");
        log.info("🔍 Obtained DB User from Secret Manager: {}", dbUser);
        return dbUser.trim();
    }

    public String getDatabasePassword() {
        String dbPassword = secretManagerTemplate.getSecretString("DB_PASSWORD");
        log.info("🔍 Obtained DB Password from Secret Manager: {}", dbPassword);
        return dbPassword.trim();
    }
}