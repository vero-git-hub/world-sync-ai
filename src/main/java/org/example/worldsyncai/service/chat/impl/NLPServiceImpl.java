package org.example.worldsyncai.service.chat.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.service.chat.NLPService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NLPServiceImpl implements NLPService {

    /**
     * Determines what the user is asking about (the intent of the request).
     *
     * @param message request text
     * @return intention (for example, "TEAM_SCHEDULE", "PLAYER_STATS", "GENERAL_QUESTION")
     */
    public String detectIntent(String message) {
        String lowerMessage = message.toLowerCase();

        if (lowerMessage.contains("when") && lowerMessage.contains("next game")) return "TEAM_SCHEDULE";
        if (lowerMessage.contains("when does") && lowerMessage.contains("play")) return "TEAM_SCHEDULE";
        if (lowerMessage.contains("match") || lowerMessage.contains("schedule")) return "TEAM_SCHEDULE";
        if (lowerMessage.contains("playing") || lowerMessage.contains("game time")) return "TEAM_SCHEDULE";

        if (lowerMessage.contains("stats") || lowerMessage.contains("performance") || lowerMessage.contains("record")) return "PLAYER_STATS";

        return "GENERAL_QUESTION";
    }
}