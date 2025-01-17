package org.example.worldsyncai.service.chat;

import org.example.worldsyncai.dto.chat.ChatResponseDto;

public interface ChatService {

    ChatResponseDto processUserQuery(String message);
}