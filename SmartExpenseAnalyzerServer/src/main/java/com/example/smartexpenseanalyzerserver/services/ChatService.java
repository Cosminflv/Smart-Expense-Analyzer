package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final TransactionRepository transactionRepository;

    public ChatService(ChatClient chatClient, TransactionRepository transactionRepository) {
        this.chatClient = chatClient;
        this.transactionRepository = transactionRepository;
    }

    /**
     * Get a simple String response (Blocking)
     */
    public String getSyncResponse(Long userId, String userMessage) {
        String context = buildTransactionContext(userId);
        return chatClient.prompt()
                .system(s -> s.text(getSystemPrompt()).param("context", context))
                .user(userMessage)
                .call()
                .content();
    }

    /**
     * Get a Streaming response (Non-blocking)
     */
    public Flux<String> getStreamResponse(Long userId, String userMessage) {
        String context = buildTransactionContext(userId);
        return chatClient.prompt()
                .system(s -> s.text(getSystemPrompt()).param("context", context))
                .user(userMessage)
                .stream()
                .content();
    }

    // --- Helper Methods ---

    private String getSystemPrompt() {
        return """
               You are a smart financial assistant. 
               Analyze the provided transaction history to answer the user's question.
               If the answer isn't in the data, say so politely.
               
               User Data:
               {context}
               """;
    }

    private String buildTransactionContext(Long userId) {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);
        LocalDate today = LocalDate.now();

        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, oneMonthAgo, today);

        if (transactions.isEmpty()) {
            return "No transactions found in the last 30 days.";
        }

        // Format as a simple list for the AI to read easily
        return transactions.stream()
                .map(t -> String.format("- %s: %.2f %s (%s)",
                        t.getTransactionDate(), t.getAmount(), t.getCategory(), t.getDescription()))
                .collect(Collectors.joining("\n"));
    }
}
