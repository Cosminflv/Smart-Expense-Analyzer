package com.example.smartexpenseanalyzerserver.dtos.login;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UsersRequest {
    private Long id;
    private String username;
}
