package com.example.smartexpenseanalyzerserver.controllers;

import com.example.smartexpenseanalyzerserver.dtos.login.AuthRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.LoginRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.RegisterRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.UsersRequest;
import com.example.smartexpenseanalyzerserver.entities.UserEntity;
import com.example.smartexpenseanalyzerserver.exceptions.InvalidCredentialsException;
import com.example.smartexpenseanalyzerserver.exceptions.UserAlreadyExistsException;
import com.example.smartexpenseanalyzerserver.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UsersRequest>> getAllUsers() {
        List<UsersRequest> users = authService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    /**
     * Endpoint for user registration.
     */
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        UserEntity user = authService.register(registerRequest);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("User registered successfully! Username: " + user.getUsername());
    }

    /**
     * Endpoint for user login.
     */
    @PostMapping("/login")
    public ResponseEntity<AuthRequest> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        // Service layer validates credentials and returns a response or throws exception
        AuthRequest authRequest = authService.login(loginRequest);
        return ResponseEntity.ok(authRequest);
    }

    // --- Exception Handlers for this Controller ---

    /**
     * Handles UserAlreadyExistsException and returns a 400 Bad Request.
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

    /**
     * Handles InvalidCredentialsException and returns a 401 Unauthorized.
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<String> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ex.getMessage());
    }
}
