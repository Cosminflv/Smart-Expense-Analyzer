package com.example.smartexpenseanalyzerserver.repositories;

import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    // Găsește toate tranzacțiile pentru un anumit utilizator
    List<TransactionEntity> findByUserId(Long userId);

    List<TransactionEntity> findByUserIdAndTransactionDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    boolean existsByUser_Id(Long userId);
    List<TransactionEntity> findTop5ByUserIdOrderByTransactionDateDesc(Long userId);

}
