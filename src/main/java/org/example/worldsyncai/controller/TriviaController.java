package org.example.worldsyncai.controller;

import lombok.RequiredArgsConstructor;
import org.example.worldsyncai.dto.game.TriviaQuestionDto;
import org.example.worldsyncai.service.game.TriviaQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> checkAnswer(@RequestParam String questionId, @RequestParam String userAnswer) {
        boolean isCorrect = triviaQuestionService.checkAnswer(questionId, userAnswer);
        return ResponseEntity.ok(isCorrect ? "✅ Correct!" : "❌ Wrong answer. Try again!");
    }
}