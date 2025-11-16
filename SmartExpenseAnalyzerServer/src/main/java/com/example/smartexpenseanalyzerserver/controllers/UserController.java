package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.services.TransactionImportService;
import com.example.smartexpenseanalyzerserver.services.UserProfileService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/users/")
public class UserController {
    private final TransactionImportService transactionImportService;
    private final UserProfileService userProfileService;

    public UserController(TransactionImportService transactionImportService, UserProfileService userProfileService) {
        this.transactionImportService = transactionImportService;
        this.userProfileService = userProfileService;
    }

    @PostMapping(
            path = "/{userId}/transactions/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE // <-- ACEASTA ESTE LINIA CHEIE
    )
    public ResponseEntity<String> uploadTransactions(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fișierul este gol.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            // Apelăm serviciul de import pe care l-am definit anterior
            transactionImportService.importTransactions(inputStream, userId);
            return ResponseEntity.ok("Tranzacțiile au fost importate cu succes.");
        } catch (Exception e) {
            // Prindem orice eroare (ex: User not found, eroare de parsare CSV)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Eroare la procesarea fișierului: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/profile/summary")
    public ResponseEntity<?> getProfileSummary(
            @PathVariable Long userId,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            // Cazul 1: Fără filtre de dată -> Sumar Total
            if (startDate == null && endDate == null) {
                Map<String, BigDecimal> summary = userProfileService.getProfileSummary(userId);
                return ResponseEntity.ok(summary);
            }

            // Cazul 2: Cu filtre de dată -> Sumar Periodic
            if (startDate != null && endDate != null) {
                Map<String, BigDecimal> summary = userProfileService.getProfileSummaryPerPeriod(userId, startDate, endDate);
                return ResponseEntity.ok(summary);
            }

            // Cazul 3: Doar un filtru de dată (lipsesc ambii sau niciunul)
            return ResponseEntity.badRequest().body("Trebuie să specificați ambele: 'startDate' și 'endDate', sau niciuna.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Eroare la generarea sumarului: " + e.getMessage());
        }
    }
}
