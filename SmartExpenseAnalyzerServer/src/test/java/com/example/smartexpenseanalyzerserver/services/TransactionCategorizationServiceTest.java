package com.example.smartexpenseanalyzerserver.services;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TransactionCategorizationServiceTest {

    private TransactionCategorizationService service;
    private static final String TRAINING_FILE_PATH = "src/main/resources/training_data.txt";

    @BeforeAll
    void setup() throws IOException {
        // Initialize the service
        service = new TransactionCategorizationService();
        service.init(); // This triggers model training
    }

    @Test
    void testPredictCategory_Spotify() {
        // Input from your CSV: "2025-01-09,Plata POS Spotify Resita,-928.72, 4071.28"
        String description = "Plata POS Spotify Resita";

        String category = service.predictCategory(description);

        System.out.println("Input: " + description + " | Predicted: " + category);
        assertEquals("ENTERTAINMENT", category);
    }

    @Test
    void testPredictCategory_Enel() {
        // Input from your CSV: "2025-01-10,Plata POS ENEL Jilava,-560.73, 6321.66"
        String description = "Plata POS ENEL Jilava";

        String category = service.predictCategory(description);

        System.out.println("Input: " + description + " | Predicted: " + category);
        assertEquals("UTILITIES", category);
    }

    @Test
    void testPredictCategory_Taxe() {
        // Input from your CSV: "2025-01-09,Restituire Taxe, 3723.00, 6882.39"
        String description = "Restituire Taxe";

        String category = service.predictCategory(description);

        System.out.println("Input: " + description + " | Predicted: " + category);
        assertEquals("INCOME", category);
    }

    @Test
    void testUnknownCategory() {
        String description = "Transfer Necunoscut Ceva Ciudat";
        String category = service.predictCategory(description);
        // Depending on OpenNLP confidence, this might pick the closest one or be weak.
        System.out.println("Input: " + description + " | Predicted: " + category);
        assertEquals("INCOME", category);
    }
}
