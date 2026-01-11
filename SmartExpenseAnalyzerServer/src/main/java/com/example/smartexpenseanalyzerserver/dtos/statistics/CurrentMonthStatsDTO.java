package com.example.smartexpenseanalyzerserver.dtos.statistics;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CurrentMonthStatsDTO {
    private long transactionCount;
    private long categoryCount;
}
