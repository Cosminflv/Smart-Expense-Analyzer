package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final TransactionRepository transactionRepository;

    public DashboardController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary(
            @RequestParam Long userId
    ) {
        boolean hasData = transactionRepository.existsByUserId(userId);

        if (!hasData) {
            return Map.of("hasData", false);
        }

        return Map.of("hasData", true);
    }
}
