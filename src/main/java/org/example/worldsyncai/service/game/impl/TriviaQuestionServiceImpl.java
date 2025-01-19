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
    private final Map<String, String> questionTexts = new HashMap<>();
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
        String questionText = questionTexts.getOrDefault(questionId, "Unknown question");

        if (correctAnswer.equalsIgnoreCase(userAnswer)) {
            return "✅ That's right! Great job!";
        } else {
            String explanation = aiService.getAIResponse(
                    "Question: \"" + questionText + "\"\n" +
                            "User replied: \"" + userAnswer + "\", but the correct answer is: \"" + correctAnswer + "\".\n" +
                            "Please explain why the correct answer is \"" + correctAnswer + "\"."
            );

            return "❌ Incorrect. The correct answer is: " + correctAnswer + ".\n\n" + explanation;
        }
    }

    @Override
    public String getQuestionText(String questionId) {
        return questionTexts.getOrDefault(questionId, "❓ Question not found.");
    }

    /**
     * Generating a question about home runs.
     */
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
        String questionText = "How many home runs did " + playerName + " hit in 2024?";

        questionAnswers.put(questionId, String.valueOf(homeRuns));
        questionTexts.put(questionId, questionText);

        return new TriviaQuestionDto(questionId, questionText, options, String.valueOf(homeRuns));
    }

    /**
     * Generating a question about the year the team was founded.
     */
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
        String questionText = "In what year was the " + teamName + " club founded?";

        questionAnswers.put(questionId, year);
        questionTexts.put(questionId, questionText);

        return new TriviaQuestionDto(questionId, questionText, options, year);
    }

    /**
     * Generating a question about the player statistics.
     */
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
        String questionText = "How many RBI did " + playerName + " hit in the 2024 season?";

        questionAnswers.put(questionId, String.valueOf(rbi));
        questionTexts.put(questionId, questionText);

        return new TriviaQuestionDto(questionId, questionText, options, String.valueOf(rbi));
    }
}