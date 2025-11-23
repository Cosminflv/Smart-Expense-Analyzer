package com.example.smartexpenseanalyzerserver.services;

import jakarta.annotation.PostConstruct;
import opennlp.tools.doccat.*;
import opennlp.tools.util.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class TransactionCategorizationService {
    private DoccatModel model;

    @PostConstruct
    public void init() {
        try {
            // Antrenam modelul la pornirea aplicatiei
            this.model = trainModel();
            System.out.println("ML Model trained successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private DoccatModel trainModel() throws IOException {
        InputStreamFactory dataIn = new MarkableFileInputStreamFactory(
                new java.io.File("src/main/resources/training_data.txt")
        );

        ObjectStream<String> lineStream = new PlainTextByLineStream(dataIn, StandardCharsets.UTF_8);
        ObjectStream<DocumentSample> sampleStream = new DocumentSampleStream(lineStream);

        // Configurare parametri antrenament (Iteratii, Cutoff)
        TrainingParameters params = new TrainingParameters();
        params.put(TrainingParameters.ITERATIONS_PARAM, 100);
        params.put(TrainingParameters.CUTOFF_PARAM, 2); // Ignora cuvintele care apar foarte rar

        return DocumentCategorizerME.train("ro", sampleStream, params, new DoccatFactory());
    }

    public String predictCategory(String description) {
        if (model == null) return "UNCATEGORIZED";

        DocumentCategorizerME myCategorizer = new DocumentCategorizerME(model);

        // Spargem descrierea in tokeni (cuvinte) pentru analiza
        String[] tokens = description.split("\\s+");

        // Obtinem probabilitatile pentru fiecare categorie
        double[] outcomes = myCategorizer.categorize(tokens);

        // Returnam categoria cea mai probabila
        return myCategorizer.getBestCategory(outcomes);
    }
}
