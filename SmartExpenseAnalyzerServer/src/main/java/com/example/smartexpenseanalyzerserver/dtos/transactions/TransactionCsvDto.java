package com.example.smartexpenseanalyzerserver.dtos.transactions;

import com.opencsv.bean.CsvBindByName;
import lombok.Data;

// Un DTO simplu pentru a mapa coloanele din CSV
@Data
public class TransactionCsvDto {

    @CsvBindByName(column = "Data")
    private String data;

    @CsvBindByName(column = "Descriere")
    private String descriere;

    @CsvBindByName(column = "Suma")
    private String suma;

    @CsvBindByName(column = "Sold Curent")
    private String soldCurent;
}
