package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.dtos.statistics.*;
import com.example.smartexpenseanalyzerserver.services.StatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/statistics/")
public class StatisticsController {
    private final StatisticsService statisticsService;

    public  StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/{userId}/breakdown")
    public ResponseEntity<List<CategoryExpenseDTO>> getCategoryBreakdown(
            @PathVariable Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<CategoryExpenseDTO> stats = statisticsService.getCategoryBreakdown(userId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}/trends/balance")
    public ResponseEntity<List<BalancePointDTO>> getBalanceEvolution(
            @PathVariable Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                statisticsService.getBalanceEvolution(userId, startDate, endDate)
        );
    }

    @GetMapping("/{userId}/trends/heatmap")
    public ResponseEntity<List<DailySpendingDTO>> getSpendingHeatmap(
            @PathVariable Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                statisticsService.getDailySpendingHeatmap(userId, startDate, endDate)
        );
    }

    @GetMapping("/{userId}/trends/weekdays")
    public ResponseEntity<List<DayOfWeekStatsDTO>> getWeekdayAnalysis(
            @PathVariable Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        return ResponseEntity.ok(
                statisticsService.getPeakSpendingDays(userId, startDate, endDate)
        );
    }

    @GetMapping("/{userId}/highlights/monthly-breakdown")
    public ResponseEntity<List<MonthlyTopCategoryDTO>> getMonthlyTopCategories(
            @PathVariable Long userId,
            @RequestParam("year") int year) {

        List<MonthlyTopCategoryDTO> report = statisticsService.getMonthlyTopCategoriesWithDetails(userId, year);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/{userId}/stats/current-month")
    public ResponseEntity<CurrentMonthStatsDTO> getCurrentMonthStats(@PathVariable Long userId) {
        return ResponseEntity.ok(
                statisticsService.getCurrentMonthStats(userId)
        );
    }
}
