package com.example.smartexpenseanalyzerserver.dtos.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class AuthRequest {
    private String message;
    private String username;
    private Long userId;
}
