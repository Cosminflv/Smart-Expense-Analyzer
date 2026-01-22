package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.dtos.gemini.ChatRequest;
import com.example.smartexpenseanalyzerserver.services.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.Map;


@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * Synchronous Endpoint
     * POST /api/chat/{userId}/sync
     */
    @PostMapping("/{userId}/sync")
    public ResponseEntity<Map<String, String>> askAssistantSync(
            @PathVariable Long userId,
            @RequestBody ChatRequest request) {

        String response = chatService.getSyncResponse(userId, request.getMessage());
        return ResponseEntity.ok(Map.of("response", response));
    }

    /**
     * Streaming Endpoint
     * POST /api/chat/{userId}/stream
     */
    @PostMapping(value = "/{userId}/stream", produces = "text/event-stream")
    public Flux<String> askAssistantStream(
            @PathVariable Long userId,
            @RequestBody ChatRequest request) {

        return chatService.getStreamResponse(userId, request.getMessage());
    }
}
