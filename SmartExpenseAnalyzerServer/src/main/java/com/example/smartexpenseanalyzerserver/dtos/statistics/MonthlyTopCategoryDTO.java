package com.example.smartexpenseanalyzerserver.dtos.statistics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class MonthlyTopCategoryDTO {
    private String month;
    private String category;
    private BigDecimal totalAmount;
    private List<TransactionDTO> transactions;

}
