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
 * Selects a random question type (team foundation year).
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

    @Value("${mlb.teams.url}")
    private String mlbTeamsUrl;

    @Override
    public TriviaQuestionDto getRandomQuestion() {
        List<String> questionTypes = Arrays.asList("teamYear");
        String questionType = questionTypes.get(new Random().nextInt(questionTypes.size()));

        TriviaQuestionDto question;
        switch (questionType) {
            case "teamYear":
                question = generateTeamYearQuestion();
                break;
            default:
                question = generateTeamYearQuestion();
        }

        if (question.getOptions().isEmpty()) {
            log.warn("⚠️ Generated an empty question! Something went wrong.");
        }

        return question;
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
}