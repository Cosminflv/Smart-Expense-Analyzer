package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.statistics.*;
import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
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
     * 1. Balance Evolution
     * Returns the balance at the end of every day that had a transaction.
     */
    public List<BalancePointDTO> getBalanceEvolution(Long userId, LocalDate startDate, LocalDate endDate) {
        // Fetch sorted by Date and ID to ensure we process the "last" transaction of the day last.
        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetweenOrderByTransactionDateAscIdAsc(userId, startDate, endDate);

        // Map to hold date -> last_balance.
        // Using LinkedHashMap to preserve date order naturally from the sorted list.
        Map<LocalDate, BigDecimal> balanceMap = new LinkedHashMap<>();

        for (TransactionEntity t : transactions) {
            // Because the list is sorted, putting the value will overwrite previous entries for the same day.
            // The last entry for a specific date will effectively be the "closing balance" for that day.
            balanceMap.put(t.getTransactionDate(), t.getCurrentBalance());
        }

        return balanceMap.entrySet().stream()
                .map(entry -> BalancePointDTO.builder()
                        .date(entry.getKey())
                        .balance(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * 2. Daily Spending Heatmap
     * Sums up expenses (negative amounts) per day.
     */
    public List<DailySpendingDTO> getDailySpendingHeatmap(Long userId, LocalDate startDate, LocalDate endDate) {
        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        // Group by Date, Filter Expenses, Sum Absolute Amount
        Map<LocalDate, BigDecimal> dailyTotals = transactions.stream()
                .filter(t -> t.getAmount().compareTo(BigDecimal.ZERO) < 0) // Expenses only
                .collect(Collectors.groupingBy(
                        TransactionEntity::getTransactionDate,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                t -> t.getAmount().abs(),
                                BigDecimal::add
                        )
                ));

        return dailyTotals.entrySet().stream()
                .map(entry -> DailySpendingDTO.builder()
                        .date(entry.getKey())
                        .totalSpent(entry.getValue())
                        .build())
                .sorted(Comparator.comparing(DailySpendingDTO::getDate)) // Sort for the calendar UI
                .collect(Collectors.toList());
    }

    /**
     * 3. Peak Spending Days (Day of Week Analysis)
     * Aggregates spending by MONDAY, TUESDAY, etc.
     */
    public List<DayOfWeekStatsDTO> getPeakSpendingDays(Long userId, LocalDate startDate, LocalDate endDate) {
        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        List<TransactionEntity> expenses = transactions.stream()
                .filter(t -> t.getAmount().compareTo(BigDecimal.ZERO) < 0)
                .toList();

        // Group by DayOfWeek
        Map<DayOfWeek, List<TransactionEntity>> groupedByDay = expenses.stream()
                .collect(Collectors.groupingBy(t -> t.getTransactionDate().getDayOfWeek()));

        List<DayOfWeekStatsDTO> stats = new ArrayList<>();

        // Iterate through all 7 days to ensure we return 0 for days with no spending (cleaner for charts)
        for (DayOfWeek day : DayOfWeek.values()) {
            List<TransactionEntity> dayTransactions = groupedByDay.getOrDefault(day, new ArrayList<>());

            BigDecimal totalAmount = dayTransactions.stream()
                    .map(t -> t.getAmount().abs())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            long count = dayTransactions.size();

            double average = count > 0
                    ? totalAmount.divide(BigDecimal.valueOf(count), RoundingMode.HALF_UP).doubleValue()
                    : 0.0;

            stats.add(DayOfWeekStatsDTO.builder()
                    .dayOfWeek(day.name())
                    .totalAmount(totalAmount)
                    .transactionCount(count)
                    .averageAmount(average)
                    .build());
        }

        // Optional: Sort by Total Amount Descending to highlight "Peak" days first
        stats.sort(Comparator.comparing(DayOfWeekStatsDTO::getTotalAmount).reversed());

        return stats;
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


    /**
     * Returns for each month the most spent on TransactionCategory with attached transactions.
     */
    public List<MonthlyTopCategoryDTO> getMonthlyTopCategoriesWithDetails(Long userId, int year) {
        List<MonthlyTopCategoryDTO> yearlyReport = new ArrayList<>();

        // Iterate through all 12 months
        for (Month month : Month.values()) {
            YearMonth yearMonth = YearMonth.of(year, month);
            LocalDate startDate = yearMonth.atDay(1);
            LocalDate endDate = yearMonth.atEndOfMonth();

            // 1. Fetch all transactions for this specific month
            List<TransactionEntity> monthTransactions = transactionRepository
                    .findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(userId, startDate, endDate);

            if (monthTransactions.isEmpty()) {
                continue; // Skip months with no activity
            }

            // 2. Find the Category with the highest spending
            Map<TransactionCategory, BigDecimal> categoryTotals = monthTransactions.stream()
                    .filter(t -> t.getAmount().compareTo(BigDecimal.ZERO) < 0) // Only expenses
                    .filter(t -> t.getCategory() != TransactionCategory.INCOME)
                    .collect(Collectors.groupingBy(
                            TransactionEntity::getCategory,
                            Collectors.reducing(
                                    BigDecimal.ZERO,
                                    t -> t.getAmount().abs(),
                                    BigDecimal::add
                            )
                    ));

            // If no expenses found (e.g., only income), skip
            if (categoryTotals.isEmpty()) continue;

            // Get the "winner" category
            Map.Entry<TransactionCategory, BigDecimal> maxEntry = categoryTotals.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .orElse(null);

            if (maxEntry != null) {
                TransactionCategory topCategory = maxEntry.getKey();
                BigDecimal topTotal = maxEntry.getValue();

                // 3. Filter the original list to get only the transactions for this top category
                List<TransactionDTO> detailedTransactions = monthTransactions.stream()
                        .filter(t -> t.getCategory() == topCategory)
                        .filter(t -> t.getAmount().compareTo(BigDecimal.ZERO) < 0) // Ensure we don't accidentally grab refunds/income if any
                        .map(t -> TransactionDTO.builder()
                                .id(t.getId())
                                .date(t.getTransactionDate())
                                .description(t.getDescription())
                                .amount(t.getAmount())
                                .category(t.getCategory())
                                .build())
                        .collect(Collectors.toList());

                // 4. Build the DTO
                yearlyReport.add(MonthlyTopCategoryDTO.builder()
                        .month(month.name())
                        .category(topCategory.toString())
                        .totalAmount(topTotal)
                        .transactions(detailedTransactions)
                        .build());
            }
        }

        return yearlyReport;
    }

    public CurrentMonthStatsDTO getCurrentMonthStats(Long userId) {
        // 1. Determine the date range for the current month
        LocalDate now = LocalDate.now();
        LocalDate startDate = now.withDayOfMonth(1);
        LocalDate endDate = now.with(TemporalAdjusters.lastDayOfMonth());

        // 2. Fetch all transactions for this month
        List<TransactionEntity> transactions = transactionRepository
                .findByUserIdAndTransactionDateBetween(userId, startDate, endDate);

        // 3. Calculate the counts
        long totalTransactions = transactions.size();

        long uniqueCategories = transactions.stream()
                .map(TransactionEntity::getCategory)
                .distinct() // Filter to keep only unique categories
                .count();

        return CurrentMonthStatsDTO.builder()
                .transactionCount(totalTransactions)
                .categoryCount(uniqueCategories)
                .build();
    }

}