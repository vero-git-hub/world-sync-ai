package org.example.worldsyncai.service.chat.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.chat.ChatResponseDto;
import org.example.worldsyncai.service.chat.ChatService;
import org.example.worldsyncai.service.chat.MlbApiService;
import org.example.worldsyncai.service.chat.AiService;
import org.springframework.stereotype.Service;

/**
 * MLB request processing service.
 * Processing user questions and generating a request to AI.
 * The final prompt now includes MLB data.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final MlbApiService mlbApiService;
    private final AiService aiService;

    @Override
    public ChatResponseDto processUserQuery(String message) {
        log.info("Processing query: {}", message);

        String mlbContext = "";

        if (message.contains("playing") || message.contains("match")) {
            String teamId = extractTeamId(message);
            mlbContext = mlbApiService.getTeamSchedule(teamId);
        }

        String prompt = "User asks: " + message + "\n\n" + "MLB Context:\n" + mlbContext;
        String aiResponse = aiService.getAIResponse(prompt);

        return new ChatResponseDto(aiResponse);
    }

    private String extractTeamId(String query) {
        if (query.contains("Dodgers")) return "119";
        if (query.contains("Yankees")) return "147";
        return "111";
    }
}