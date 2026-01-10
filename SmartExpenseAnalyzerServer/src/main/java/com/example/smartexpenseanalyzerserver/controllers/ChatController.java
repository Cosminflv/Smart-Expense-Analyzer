package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.dtos.gemini.ChatRequest;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import com.example.smartexpenseanalyzerserver.services.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;
    private final TransactionRepository transactionRepository;

    public ChatController(GeminiService geminiService, TransactionRepository transactionRepository) {
        this.geminiService = geminiService;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Map<String, String>> askAssistant(
            @PathVariable Long userId,
            @RequestBody ChatRequest request) {

        // 1. Fetch Context: Get transactions from the last 30 days
        // (You can adjust this window or fetch the last 50 transactions regardless of date)
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        LocalDate today = LocalDate.now();

        List<TransactionEntity> recentTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, oneMonthAgo, today);

        if (recentTransactions.isEmpty()) {
            return ResponseEntity.ok(Map.of("response", "I don't see any transactions in the last 30 days to analyze."));
        }

        // 2. Get Answer from AI
        String aiResponse = geminiService.answerUserQuestion(request.getMessage(), recentTransactions);

        // 3. Return JSON
        return ResponseEntity.ok(Map.of("response", aiResponse));
    }
}
