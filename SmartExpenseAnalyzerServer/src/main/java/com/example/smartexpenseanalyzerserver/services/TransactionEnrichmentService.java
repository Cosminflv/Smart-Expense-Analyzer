package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import org.springframework.stereotype.Service;

@Service
public class TransactionEnrichmentService {

    private final TransactionCategorizationService mlService;

    public TransactionEnrichmentService(TransactionCategorizationService mlService) {
        this.mlService = mlService;
    }

    public void enrich(TransactionEntity transaction) {
        String desc = transaction.getDescription();

        // Folosim ML pentru a prezice categoria
        String predictedCategory = mlService.predictCategory(desc);

        // Convertim string-ul in Enum-ul nostru
        try {
            transaction.setCategory(TransactionCategory.valueOf(predictedCategory));
        } catch (IllegalArgumentException e) {
            transaction.setCategory(TransactionCategory.UNCATEGORIZED);
        }

        // ...
    }
}
