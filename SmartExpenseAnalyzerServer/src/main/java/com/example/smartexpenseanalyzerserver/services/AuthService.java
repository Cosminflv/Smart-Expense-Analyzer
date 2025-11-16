package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.login.AuthResponse;
import com.example.smartexpenseanalyzerserver.dtos.login.LoginRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.RegisterRequest;
import com.example.smartexpenseanalyzerserver.entities.UserEntity;
import com.example.smartexpenseanalyzerserver.exceptions.InvalidCredentialsException;
import com.example.smartexpenseanalyzerserver.exceptions.UserAlreadyExistsException;
import com.example.smartexpenseanalyzerserver.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserEntity register(RegisterRequest registerRequest) {
        if(userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new UserAlreadyExistsException("Username " + registerRequest.getUsername() + " already exists");
        }

        UserEntity user = UserEntity.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        // --- Business Logic: Find user by username ---
        UserEntity user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password."));

        // --- Business Logic: Check if password matches ---
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password.");
        }

        // --- Success: Return a response ---
        // In a real app, you would generate a JWT token here
        return new AuthResponse("User logged in successfully.", user.getUsername(), user.getId());
    }
}
