package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.dtos.statistics.CategoryExpenseDTO;
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
import java.util.List;
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
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadTransactions(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("The file is empty.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            transactionImportService.importTransactions(inputStream, userId);
            return ResponseEntity.ok("Transactions imported successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing the file: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/profile/summary")
    public ResponseEntity<?> getProfileSummary(
            @PathVariable Long userId,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        try {
            // Case 1: No date filters -> Total Summary
            if (startDate == null && endDate == null) {
                Map<String, BigDecimal> summary = userProfileService.getProfileSummary(userId);
                return ResponseEntity.ok(summary);
            }

            // Case 2: With date filters -> Periodic Summary
            if (startDate != null && endDate != null) {
                Map<String, BigDecimal> summary = userProfileService.getProfileSummaryPerPeriod(userId, startDate, endDate);
                return ResponseEntity.ok(summary);
            }

            // Case 3: Only one date filter provided (must verify both or neither)
            return ResponseEntity.badRequest().body("You must specify both 'startDate' and 'endDate', or neither.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating summary: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}/breakdown")
    public ResponseEntity<List<CategoryExpenseDTO>> getCategoryBreakdown(
            @PathVariable Long userId,
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<CategoryExpenseDTO> stats = userProfileService.getCategoryBreakdown(userId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}/transactions/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentTransactions(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userProfileService.getRecentTransactions(userId)
        );
    }

}