package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class UserProfileService {

    private final TransactionRepository transactionRepository;

    public UserProfileService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Map<String, BigDecimal> getProfileSummary(Long userId) {
        List<TransactionEntity> transactions = transactionRepository.findByUserId(userId);

        // Calculează Veniturile
        BigDecimal totalIncome = transactions.stream()
                .map(TransactionEntity::getAmount)
                .filter(amount -> amount.compareTo(BigDecimal.ZERO) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculează Cheltuielile
        BigDecimal totalExpenses = transactions.stream()
                .map(TransactionEntity::getAmount)
                .filter(amount -> amount.compareTo(BigDecimal.ZERO) < 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add).abs(); // .abs() pentru a-l afișa ca număr pozitiv

        // Calculează Economiile
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);


        return Map.of(
                "totalIncome", totalIncome,
                "totalExpenses", totalExpenses,
                "netSavings", netSavings
        );
    }

    public Map<String, BigDecimal> getProfileSummaryPerPeriod(Long userId, LocalDate startDate, LocalDate endDate) {
        // Folosim noua metodă din repository
        List<TransactionEntity> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(userId, startDate, endDate);
        return calculateSummary(transactions); // Reutilizăm aceeași logică de calcul
    }

    private Map<String, BigDecimal> calculateSummary(List<TransactionEntity> transactions) {
        // Calculează Veniturile
        BigDecimal totalIncome = transactions.stream()
                .map(TransactionEntity::getAmount)
                .filter(amount -> amount.compareTo(BigDecimal.ZERO) > 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calculează Cheltuielile
        BigDecimal totalExpenses = transactions.stream()
                .map(TransactionEntity::getAmount)
                .filter(amount -> amount.compareTo(BigDecimal.ZERO) < 0)
                .reduce(BigDecimal.ZERO, BigDecimal::add).abs(); // .abs() pentru a-l afișa ca număr pozitiv

        // Calculează Economiile
        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        return Map.of(
                "totalIncome", totalIncome,
                "totalExpenses", totalExpenses,
                "netSavings", netSavings
        );
    }
}