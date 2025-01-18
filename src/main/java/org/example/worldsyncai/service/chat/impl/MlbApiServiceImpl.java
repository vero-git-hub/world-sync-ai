package org.example.worldsyncai.service.chat.impl;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.MlbApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class MlbApiServiceImpl implements MlbApiService {

    @Value("${mlb.schedule.url}")
    private String scheduleUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Get a team's match schedule.
     *
     * @param teamId the ID of the team
     * @return the date and opponent of the next game
     */
    public String getTeamSchedule(String teamId) {
        String url = scheduleUrl + "&teamId=" + teamId;
        log.info("Fetching schedule from: {}", url);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            String responseBody = response.getBody();
            log.info("MLB API Response: {}", responseBody);

            JsonObject jsonResponse = JsonParser.parseString(responseBody).getAsJsonObject();
            JsonArray datesArray = jsonResponse.getAsJsonArray("dates");

            if (datesArray == null || datesArray.size() == 0) {
                return "The team has no upcoming games.";
            }

            JsonObject firstDate = datesArray.get(0).getAsJsonObject();
            String gameDate = firstDate.get("date").getAsString();
            JsonArray gamesArray = firstDate.getAsJsonArray("games");

            if (gamesArray == null || gamesArray.size() == 0) {
                return "The team has no upcoming games.";
            }

            JsonObject firstGame = gamesArray.get(0).getAsJsonObject();
            String homeTeam = firstGame.getAsJsonObject("teams").getAsJsonObject("home").getAsJsonObject("team").get("name").getAsString();
            String awayTeam = firstGame.getAsJsonObject("teams").getAsJsonObject("away").getAsJsonObject("team").get("name").getAsString();

            return String.format("Next game %s vs %s will take place %s.", awayTeam, homeTeam, gameDate);

        } catch (Exception e) {
            log.error("Error processing MLB API schedule.", e);
            return "Error getting schedule.";
        }
    }
}