package org.example.worldsyncai.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TriviaQuestionDto {

    private String id;

    private String question;

    private List<String> options;

    private String correctAnswer;
}