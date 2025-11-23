package com.example.smartexpenseanalyzerserver.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate transactionDate;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount; // Suma

    @Column(nullable = false)
    private BigDecimal currentBalance; // Sold Curent

    @Enumerated(EnumType.STRING)
    private TransactionCategory category; // ex: SUPERMARKET, UTILITIES

    // Relația Many-to-One: Mai multe tranzacții aparțin unui singur utilizator
    @ManyToOne(fetch = FetchType.LAZY) // LAZY = nu încărca utilizatorul până nu e nevoie
    @JoinColumn(name = "user_id", nullable = false) // Cheia externă în tabelul 'transactions'
    private UserEntity user;
}

