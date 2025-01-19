package org.example.worldsyncai.service.game.impl;

import org.example.worldsyncai.dto.game.TriviaQuestionDto;
import org.example.worldsyncai.service.chat.AiService;
import org.example.worldsyncai.service.game.TriviaQuestionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Selects a random question type (home runs, team foundation year, player stats).
 * Generates a question, answer choices, and the correct answer.
 * Checks if the user's answer is correct.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TriviaQuestionServiceImpl implements TriviaQuestionService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final Map<String, String> questionAnswers = new HashMap<>();
    private final AiService aiService;

    @Value("${mlb.stats.home-runs}")
    private String mlbStatsHomeRunsUrl;

    @Value("${mlb.teams.url}")
    private String mlbTeamsUrl;

    @Value("${mlb.people.stats}")
    private String mlbPeopleStatsUrl;

    @Override
    public TriviaQuestionDto getRandomQuestion() {
        List<String> questionTypes = Arrays.asList("homeRuns", "teamYear", "playerStats");
        String questionType = questionTypes.get(new Random().nextInt(questionTypes.size()));

        switch (questionType) {
            case "homeRuns": return generateHomeRunQuestion();
            case "teamYear": return generateTeamYearQuestion();
            case "playerStats": return generatePlayerStatQuestion();
            default: return generateHomeRunQuestion();
        }
    }

    @Override
    public String checkAnswer(String questionId, String userAnswer) {
        String correctAnswer = questionAnswers.getOrDefault(questionId, "");

        if (correctAnswer.equalsIgnoreCase(userAnswer)) {
            return "✅ That's right! Great job!";
        } else {
            String questionText = retrieveQuestionText(questionId);

            String explanation = aiService.getAIResponse(
                    "Question: \"" + questionText + "\"\n" +
                            "User replied: \"" + userAnswer + "\", but the correct answer is: \"" + correctAnswer + "\".\n" +
                            "Please explain why the correct answer is \"" + correctAnswer + "\"."
            );

            return "❌ Incorrect. The correct answer is: " + correctAnswer + ".\n\n" + explanation;
        }
    }

    private String retrieveQuestionText(String questionId) {
        return questionAnswers.containsKey(questionId) ? "This question was about baseball." : "No data about the question.";
    }

    private TriviaQuestionDto generateHomeRunQuestion() {
        Map response = restTemplate.getForObject(mlbStatsHomeRunsUrl, Map.class);

        if (response == null || !response.containsKey("stats")) {
            return new TriviaQuestionDto(UUID.randomUUID().toString(), "Error loading data.", Collections.emptyList(), "");
        }

        List<Map> leaders = (List<Map>) ((List<Map>) response.get("stats")).get(0).get("splits");
        if (leaders.isEmpty()) return new TriviaQuestionDto(UUID.randomUUID().toString(), "No data", Collections.emptyList(), "");

        Map<String, Object> topPlayer = leaders.get(0);
        String playerName = (String) ((Map) topPlayer.get("player")).get("fullName");
        int homeRuns = (int) ((Map) topPlayer.get("stat")).get("homeRuns");

        List<String> options = Arrays.asList(
                String.valueOf(homeRuns),
                String.valueOf(homeRuns - 2),
                String.valueOf(homeRuns + 1),
                String.valueOf(homeRuns - 5)
        );
        Collections.shuffle(options);

        String questionId = UUID.randomUUID().toString();
        questionAnswers.put(questionId, String.valueOf(homeRuns));

        return new TriviaQuestionDto(questionId, "How many home runs did hit " + playerName + " in 2024?", options, String.valueOf(homeRuns));
    }

    private TriviaQuestionDto generateTeamYearQuestion() {
        Map response = restTemplate.getForObject(mlbTeamsUrl, Map.class);

        if (response == null || !response.containsKey("teams")) {
            return new TriviaQuestionDto(UUID.randomUUID().toString(), "Error loading data.", Collections.emptyList(), "");
        }

        List<Map> teams = (List<Map>) response.get("teams");
        Map<String, Object> randomTeam = teams.get(new Random().nextInt(teams.size()));

        String teamName = (String) randomTeam.get("name");
        String year = (String) randomTeam.get("firstYearOfPlay");

        List<String> options = Arrays.asList(
                year,
                String.valueOf(Integer.parseInt(year) + 5),
                String.valueOf(Integer.parseInt(year) - 3),
                String.valueOf(Integer.parseInt(year) + 10)
        );
        Collections.shuffle(options);

        String questionId = UUID.randomUUID().toString();
        questionAnswers.put(questionId, year);

        return new TriviaQuestionDto(questionId, "In what year was the " + teamName + " club founded?", options, year);
    }

    private TriviaQuestionDto generatePlayerStatQuestion() {
        Map response = restTemplate.getForObject(mlbPeopleStatsUrl, Map.class);

        if (response == null || !response.containsKey("people")) {
            return new TriviaQuestionDto(UUID.randomUUID().toString(), "Error loading data.", Collections.emptyList(), "");
        }

        Map playerData = (Map) ((List) response.get("people")).get(0);
        String playerName = (String) playerData.get("fullName");
        Map stats = (Map) ((List) ((Map) ((List) playerData.get("stats")).get(0)).get("splits")).get(0);
        int rbi = (int) ((Map) stats.get("stat")).get("rbi");

        List<String> options = Arrays.asList(
                String.valueOf(rbi),
                String.valueOf(rbi - 5),
                String.valueOf(rbi + 10),
                String.valueOf(rbi - 3)
        );
        Collections.shuffle(options);

        String questionId = UUID.randomUUID().toString();
        questionAnswers.put(questionId, String.valueOf(rbi));

        return new TriviaQuestionDto(questionId, "How many RBI did " + playerName + " hit in the 2024 season?", options, String.valueOf(rbi));
    }
}