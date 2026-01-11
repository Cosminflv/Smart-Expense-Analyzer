package com.example.smartexpenseanalyzerserver.repositories;

import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Găsește toate tranzacțiile pentru un anumit utilizator
    List<TransactionEntity> findByUserId(Long userId);

    List<TransactionEntity> findByUserIdAndTransactionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    boolean existsUserById(Long userId);

    List<TransactionEntity> findTop5ByUserIdOrderByTransactionDateDesc(Long userId);

    // Needed for Balance Evolution to ensure we process transactions in the exact order they happened
    List<TransactionEntity> findByUserIdAndTransactionDateBetweenOrderByTransactionDateAscIdAsc(
            Long userId, LocalDate startDate, LocalDate endDate
    );

    // For fetching top spending days specifically (optional optimization, but logic is usually easier in Service)
    List<TransactionEntity> findByUserIdAndTransactionDateBetweenAndAmountLessThan(
            Long userId, LocalDate startDate, LocalDate endDate, java.math.BigDecimal amount
    );

    List<TransactionEntity> findByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );

}
