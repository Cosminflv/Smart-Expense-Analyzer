package com.example.smartexpenseanalyzerserver.dtos.statistics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DayOfWeekStatsDTO {
    private String dayOfWeek;
    private BigDecimal totalAmount;
    private double averageAmount;
    private long transactionCount;
}
