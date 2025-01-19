package org.example.worldsyncai.service.chat.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.MlbApiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class MlbApiServiceImpl implements MlbApiService {

    private final RestTemplate restTemplate;
    private final Map<String, String> teamIdMap = new HashMap<>();

    @Value("${mlb.teams.url}")
    private String teamsUrl;

    @Value("${mlb.schedule.url}")
    private String scheduleUrl;

    /**
     * Inject RestTemplate via constructor.
     * Spring will inject bean from AppConfig.
     */
    public MlbApiServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Loads a list of MLB commands from the API.
     * Caches their IDs after bean initialization.
     */
    @PostConstruct
    private void loadTeams() {
        try {
            String response = restTemplate.getForObject(teamsUrl, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response);

            for (JsonNode team : jsonNode.get("teams")) {
                String teamName = team.get("teamName").asText();
                String fullName = team.get("name").asText();
                String teamId = team.get("id").asText();

                teamIdMap.put(teamName.toLowerCase(), teamId);
                teamIdMap.put(fullName.toLowerCase(), teamId);
            }
        } catch (Exception e) {
            log.error("Error loading MLB teams", e);
        }
    }

    @Override
    public String getTeamIdByName(String name) {
        String team = teamIdMap.getOrDefault(name.toLowerCase(), "Unknown Team");
        return team;
    }

    @Override
    public String getTeamSchedule(String teamId) {
        String url = scheduleUrl + "&teamId=" + teamId;

        try {
            String response = restTemplate.getForObject(url, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonResponse = objectMapper.readTree(response);
            JsonNode datesArray = jsonResponse.get("dates");

            if (datesArray == null || datesArray.isEmpty()) {
                return "The team has no upcoming games.";
            }

            JsonNode firstDate = datesArray.get(0);
            String gameDate = firstDate.get("date").asText();
            JsonNode gamesArray = firstDate.get("games");

            if (gamesArray == null || gamesArray.isEmpty()) {
                return "The team has no upcoming games.";
            }

            JsonNode firstGame = gamesArray.get(0);
            String homeTeam = firstGame.get("teams").get("home").get("team").get("name").asText();
            String awayTeam = firstGame.get("teams").get("away").get("team").get("name").asText();

            return String.format("Next game: %s vs %s on %s.", awayTeam, homeTeam, gameDate);

        } catch (Exception e) {
            log.error("Error processing MLB API schedule.", e);
            return "Error getting schedule.";
        }
    }

    /**
     * Returns a cached map of teamIds to look up in `ChatServiceImpl`.
     */
    @Override
    public Map<String, String> getTeamIdMap() {
        return teamIdMap;
    }
}