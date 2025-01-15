package org.example.worldsyncai.service;

import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "World Sync AI";
    private static final String CREDENTIALS_FILE_PATH = "src/main/resources/credentials/google-credentials.json";

    public Calendar getCalendarService(String accessToken) throws IOException {
        var httpTransport = new NetHttpTransport();
        var jsonFactory = JacksonFactory.getDefaultInstance();

        GoogleCredential credential = new GoogleCredential.Builder()
                .setTransport(httpTransport)
                .setJsonFactory(jsonFactory)
                .build()
                .setAccessToken(accessToken);

        return new Calendar.Builder(httpTransport, jsonFactory, credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public Calendar getCalendarServiceFromCredentials() throws IOException {
        GoogleCredential credential = GoogleCredential.fromStream(new FileInputStream(CREDENTIALS_FILE_PATH))
                .createScoped(Collections.singletonList("https://www.googleapis.com/auth/calendar.events"));

        return new Calendar.Builder(
                credential.getTransport(),
                credential.getJsonFactory(),
                credential)
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    public String exchangeCodeForTokens(String code, String clientId, String clientSecret, String redirectUri) throws IOException {
        TokenResponse response = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                "https://oauth2.googleapis.com/token",
                clientId,
                clientSecret,
                code,
                redirectUri
        ).execute();

        return response.getAccessToken();
    }

    public void createEvent(String accessToken, Event event) throws IOException {
        Calendar service = getCalendarService(accessToken);
        service.events().insert("primary", event).execute();
        log.info("Event created: {}", event.getSummary());
    }

    /**
     * Creates a calendar event using service account credentials.
     * Useful for server-to-server communication without user authorization.
     */
    public void createEventFromCredentials(Event event) throws IOException {
        Calendar service = getCalendarServiceFromCredentials();
        service.events().insert("primary", event).execute();
    }
}