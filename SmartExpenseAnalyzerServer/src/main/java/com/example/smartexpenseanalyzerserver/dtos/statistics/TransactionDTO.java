package com.example.smartexpenseanalyzerserver.dtos.statistics;

import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class TransactionDTO {
    private Long id;
    private LocalDate date;
    private String description;
    private BigDecimal amount;
    private TransactionCategory category;
}
