package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.transactions.TransactionCsvDto;
import com.example.smartexpenseanalyzerserver.entities.TransactionEntity;
import com.example.smartexpenseanalyzerserver.entities.UserEntity;
import com.example.smartexpenseanalyzerserver.repositories.TransactionRepository;
import com.example.smartexpenseanalyzerserver.repositories.UserRepository;
import com.opencsv.bean.CsvToBeanBuilder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionImportService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionEnrichmentService enrichmentService;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public TransactionImportService(UserRepository userRepository,
                                    TransactionRepository transactionRepository,
                                    TransactionEnrichmentService enrichmentService) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.enrichmentService = enrichmentService;
    }

    @Transactional
    public void importTransactions(InputStream csvInputStream, Long userId) {
        // 1. Găsește utilizatorul
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul cu ID " + userId + " nu a fost găsit."));

        // 2. Parsează CSV-ul folosind DTO-ul
        List<TransactionCsvDto> dtos = new CsvToBeanBuilder<TransactionCsvDto>(new InputStreamReader(csvInputStream))
                .withType(TransactionCsvDto.class)
                .build()
                .parse();

        // 3. Transformă DTO-urile în Entități
        List<TransactionEntity> transactions = new ArrayList<>();
        for (TransactionCsvDto dto : dtos) {
            TransactionEntity transaction = new TransactionEntity();

            // Parsare și curățare date
            transaction.setTransactionDate(LocalDate.parse(dto.getData(), dateFormatter));
            transaction.setDescription(dto.getDescriere());

            // Curățăm suma de spații și o convertim în BigDecimal
            BigDecimal amount = new BigDecimal(dto.getSuma().trim().replace(",", ""));
            transaction.setAmount(amount);

            BigDecimal balance = new BigDecimal(dto.getSoldCurent().trim().replace(",", ""));
            transaction.setCurrentBalance(balance);

            // 4. Asociază tranzacția cu utilizatorul
            transaction.setUser(user);

            enrichmentService.enrich(transaction);

            transactions.add(transaction);
        }

        // 5. Salvează toate tranzacțiile în baza de date
        transactionRepository.saveAll(transactions);
    }
}