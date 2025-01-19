package org.example.worldsyncai.controller.game;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.game.TriviaQuestionDto;
import org.example.worldsyncai.service.game.TriviaQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trivia")
@RequiredArgsConstructor
public class TriviaController {

    private final TriviaQuestionService triviaQuestionService;

    @GetMapping("/question")
    public ResponseEntity<TriviaQuestionDto> getQuestion() {
        TriviaQuestionDto question = triviaQuestionService.getRandomQuestion();
        return ResponseEntity.ok(question);
    }

    @PostMapping("/answer")
    public ResponseEntity<Map<String, String>> checkAnswer(@RequestBody Map<String, String> requestBody) {
        String questionId = requestBody.get("questionId");
        String userAnswer = requestBody.get("userAnswer");

        if (questionId == null || userAnswer == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "reply", "❌ Invalid request. Please provide questionId and userAnswer.",
                    "question", "No question available"
            ));
        }

        String responseMessage = triviaQuestionService.checkAnswer(questionId, userAnswer);
        String questionText = triviaQuestionService.getQuestionText(questionId);

        return ResponseEntity.ok(Map.of(
                "reply", responseMessage,
                "question", questionText
        ));
    }
}