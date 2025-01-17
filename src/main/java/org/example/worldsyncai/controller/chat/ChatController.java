package org.example.worldsyncai.controller.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.chat.ChatRequestDto;
import org.example.worldsyncai.dto.chat.ChatResponseDto;
import org.example.worldsyncai.service.chat.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponseDto> chatWithAI(@RequestBody ChatRequestDto request) {
        log.info("Received chat request: {}", request.getMessage());

        ChatResponseDto response = chatService.processUserQuery(request.getMessage());

        return ResponseEntity.ok(response);
    }
}