package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.statistics.*;
import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

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

    public List<Map<String, Object>> getRecentTransactions(Long userId) {
        return transactionRepository
                .findTop5ByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(t -> Map.<String, Object>of(
                        "id", t.getId(),
                        "title", t.getDescription(),
                        "category", t.getCategory().name(),
                        "amount", t.getAmount()
                ))
                .toList();
    }

    /**
     * Returns full transaction history for a specific period, sorted by newest first.
     */
    public List<TransactionDTO> getTransactionsByPeriod(Long userId, LocalDate startDate, LocalDate endDate) {
        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);

        return transactions.stream()
                .map(t -> TransactionDTO.builder()
                        .id(t.getId())
                        .date(t.getTransactionDate())
                        .description(t.getDescription())
                        .amount(t.getAmount())
                        .category(t.getCategory())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearUserTransactions(Long userId) {
        // This removes all entries for this user from the database
        transactionRepository.deleteByUserId(userId);
    }
}