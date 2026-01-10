package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.statistics.CategoryExpenseDTO;
import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
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

    public List<CategoryExpenseDTO> getCategoryBreakdown(Long userId, LocalDate startDate, LocalDate endDate) {
        // 1. Fetch CURRENT period transactions
        List<TransactionEntity> currentTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        // 2. Fetch PREVIOUS period transactions (for the delta comparison)
        // Assumption: If looking at Nov 1-30, compare with Oct 1-31
        LocalDate prevStartDate = startDate.minusMonths(1);
        LocalDate prevEndDate = endDate.minusMonths(1);
        List<TransactionEntity> prevTransactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, prevStartDate, prevEndDate);

        // 3. Calculate Total Expense for the current period (needed for Pie Chart %)
        BigDecimal totalCurrentExpenses = currentTransactions.stream()
                .map(TransactionEntity::getAmount)
                .filter(amount -> amount.compareTo(BigDecimal.ZERO) < 0) // Only expenses
                .reduce(BigDecimal.ZERO, BigDecimal::add).abs();

        if (totalCurrentExpenses.compareTo(BigDecimal.ZERO) == 0) {
            return new ArrayList<>(); // No expenses, return empty list
        }

        // 4. Group Current Expenses by Category
        Map<TransactionCategory, BigDecimal> currentMap = groupExpensesByCategory(currentTransactions);

        // 5. Group Previous Expenses by Category
        Map<TransactionCategory, BigDecimal> prevMap = groupExpensesByCategory(prevTransactions);

        // 6. Build the DTO List
        List<CategoryExpenseDTO> report = new ArrayList<>();

        for (Map.Entry<TransactionCategory, BigDecimal> entry : currentMap.entrySet()) {
            TransactionCategory cat = entry.getKey();
            BigDecimal currentAmount = entry.getValue(); // Already absolute/positive from helper method

            // Calculate Pie Chart Percentage: (Category Amount / Total Expenses) * 100
            double percentageOfTotal = currentAmount
                    .divide(totalCurrentExpenses, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal(100))
                    .doubleValue();

            // Calculate Delta vs Previous Month: ((Current - Prev) / Prev) * 100
            Double percentageChange = null;
            if (prevMap.containsKey(cat)) {
                BigDecimal prevAmount = prevMap.get(cat);
                if (prevAmount.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal change = currentAmount.subtract(prevAmount);
                    percentageChange = change
                            .divide(prevAmount, 4, RoundingMode.HALF_UP)
                            .multiply(new BigDecimal(100))
                            .doubleValue();
                }
            } else {
                // If it didn't exist last month, it's 100% increase (or technically infinite)
                // We can denote this as 100.0 or leave null based on frontend preference
                percentageChange = 100.0;
            }

            report.add(CategoryExpenseDTO.builder()
                    .transactionCategory(cat)
                    .totalAmount(currentAmount)
                    .percentageOfTotal(percentageOfTotal)
                    .percentageChange(percentageChange)
                    .build());
        }

        // 7. Sort: Highest expenses first (Top 3 will be the first 3 elements)
        return report.stream()
                .sorted(Comparator.comparing(CategoryExpenseDTO::getTotalAmount).reversed())
                .collect(Collectors.toList());
    }

    // Helper method to group and sum absolute values of expenses
    private Map<TransactionCategory, BigDecimal> groupExpensesByCategory(List<TransactionEntity> transactions) {
        return transactions.stream()
                .filter(t -> t.getAmount().compareTo(BigDecimal.ZERO) < 0) // Only expenses
                .filter(t -> t.getCategory() != TransactionCategory.INCOME) // Exclude INCOME category specifically
                .collect(Collectors.groupingBy(
                        TransactionEntity::getCategory,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                t -> t.getAmount().abs(), // Make positive
                                BigDecimal::add
                        )
                ));
    }
}