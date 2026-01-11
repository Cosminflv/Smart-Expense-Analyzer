package com.example.smartexpenseanalyzerserver.dtos.statistics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;


@Data
@Builder
public class BalancePointDTO {
    private LocalDate date;
    private BigDecimal balance;
}
