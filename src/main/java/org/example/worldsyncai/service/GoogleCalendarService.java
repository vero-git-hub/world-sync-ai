package org.example.worldsyncai.service;

import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;

import java.io.IOException;

public interface GoogleCalendarService {

    Calendar getCalendarService(String accessToken) throws IOException;

    Calendar getCalendarServiceFromCredentials()throws IOException;

    String exchangeCodeForTokens(String code, String clientId, String clientSecret, String redirectUri) throws IOException;

    void createEvent(String accessToken, Event event) throws IOException;

    void createEventFromCredentials(Event event) throws IOException;
}