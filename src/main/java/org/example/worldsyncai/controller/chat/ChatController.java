package org.example.worldsyncai.controller.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.chat.ChatResponseDto;
import org.example.worldsyncai.service.chat.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST API for frontend.
 * Provides the API endpoints for frontend interaction with AI.
 */
@RestController
@RequestMapping("/api/ai/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/mlb")
    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message cannot be empty"));
        }

        ChatResponseDto response = chatService.processUserQuery(userMessage);
        return ResponseEntity.ok(Map.of("reply", response.getResponse()));
    }
}