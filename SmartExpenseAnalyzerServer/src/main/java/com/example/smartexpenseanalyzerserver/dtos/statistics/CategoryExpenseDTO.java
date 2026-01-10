package com.example.smartexpenseanalyzerserver.dtos.statistics;

import com.example.smartexpenseanalyzerserver.entities.TransactionCategory;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CategoryExpenseDTO {
    private TransactionCategory  transactionCategory;
    private BigDecimal totalAmount;
    private double percentageOfTotal;
    private double percentageChange;
}
