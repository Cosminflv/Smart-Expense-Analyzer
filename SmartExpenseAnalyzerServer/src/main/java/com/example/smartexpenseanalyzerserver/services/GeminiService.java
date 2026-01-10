package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import org.springframework.stereotype.Service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    private final Client client;
    private final String modelName;

    public GeminiService(@Value("${gemini.api.key}") String apiKey,
                         @Value("${gemini.model.name}") String modelName) {
        this.client = Client.builder().apiKey(apiKey).build();
        this.modelName = modelName;
    }

    public String answerUserQuestion(String userQuestion, List<TransactionEntity> transactions) {
        try {
            // 1. Create a "Context" string from the transaction list
            // We limit the data to avoid hitting token limits if the user has thousands of transactions.
            String transactionContext = transactions.stream()
                    .map(t -> String.format("[%s] %s: %.2f (%s)",
                            t.getTransactionDate(),
                            t.getDescription(),
                            t.getAmount(),
                            t.getCategory()))
                    .collect(Collectors.joining("\n"));

            // 2. Build the Prompt
            String systemPrompt = String.format("""
                You are SmartExpenseAnalyzer, a helpful financial assistant.
                
                Here is the user's financial data for the current period (Negative = Expense, Positive = Income):
                --- START DATA ---
                %s
                --- END DATA ---
                
                User Question: "%s"
                
                Answer the user based strictly on the data provided above. 
                If the answer cannot be found in the data, say "I don't have enough information in your recent history."
                Keep the answer concise and friendly.
                """, transactionContext, userQuestion);

            // 3. Call Gemini
            GenerateContentResponse response = client.models.generateContent(
                    modelName,
                    systemPrompt,
                    null
            );

            return response.text().trim();

        } catch (Exception e) {
            return "I'm having trouble analyzing your data right now. Please try again later.";
        }
    }
}
