package com.example.smartexpenseanalyzerserver.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "app_users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @OneToMany(
            mappedBy = "user", // "user" este numele câmpului din TransactionEntity
            cascade = CascadeType.ALL, // Șterge/salvează tranzacțiile odată cu user-ul
            orphanRemoval = true // Șterge tranzacțiile care nu mai sunt legate de user
    )
    private List<TransactionEntity> transactions = new ArrayList<>();
}
