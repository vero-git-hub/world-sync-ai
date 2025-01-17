package org.example.worldsyncai.service.chat.impl;

import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.MlbApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class MlbApiServiceImpl implements MlbApiService {

    @Value("${mlb.api.url}")
    private String mlbApiUrl;

    @Value("${mlb.api.key}")
    private String apiKey;

    @Override
    public String getRelevantData(String userQuery) {
        try {
            String date = "2025-01-17";
            String url = mlbApiUrl + date + "?key=" + apiKey;

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(url, String.class);

            log.info("Fetched MLB data: {}", response);
            return response;
        } catch (Exception e) {
            log.error("Error fetching MLB data", e);
            return "Не удалось получить данные MLB.";
        }
    }
}