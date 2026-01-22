package com.example.smartexpenseanalyzerserver.dtos.gemini;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ChatRequest {
    private String message;
}
