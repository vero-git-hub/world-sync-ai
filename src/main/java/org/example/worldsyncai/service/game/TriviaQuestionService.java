package org.example.worldsyncai.service.game;

import org.example.worldsyncai.dto.game.TriviaQuestionDto;

public interface TriviaQuestionService {

    /**
     * Generates a random question via the MLB API.
     * @return an object with the question and answer options.
     */
    TriviaQuestionDto getRandomQuestion();

    /**
     * Checks the user's answer to the question.
     * @param questionId Question ID.
     * @param userAnswer User's answer.
     * @return string indicating that the answer is correct, and if not, explains why.
     */
    String checkAnswer(String questionId, String userAnswer);

    String getQuestionText(String questionId);
}