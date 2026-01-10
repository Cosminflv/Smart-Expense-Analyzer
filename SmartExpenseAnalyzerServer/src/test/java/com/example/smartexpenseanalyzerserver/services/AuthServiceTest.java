package com.example.smartexpenseanalyzerserver.services;

import com.example.smartexpenseanalyzerserver.dtos.login.AuthRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.LoginRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.RegisterRequest;
import com.example.smartexpenseanalyzerserver.dtos.login.UsersRequest;
import com.example.smartexpenseanalyzerserver.entities.UserEntity;
import com.example.smartexpenseanalyzerserver.exceptions.InvalidCredentialsException;
import com.example.smartexpenseanalyzerserver.exceptions.UserAlreadyExistsException;
import com.example.smartexpenseanalyzerserver.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    // --- REGISTER TESTS ---

    @Test
    void register_ShouldSaveUser_WhenUsernameIsUnique() {
        // Arrange
        RegisterRequest req = RegisterRequest.builder().username("newUser").password("password123").build();
        UserEntity savedUser = UserEntity.builder().id(1L).username("newUser").password("encodedPass").build();

        when(userRepository.existsByUsername(req.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(req.getPassword())).thenReturn("encodedPass");
        when(userRepository.save(any(UserEntity.class))).thenReturn(savedUser);

        // Act
        UserEntity result = authService.register(req);

        // Assert
        assertNotNull(result);
        assertEquals("newUser", result.getUsername());
        assertEquals("encodedPass", result.getPassword());
        verify(userRepository).save(any(UserEntity.class)); // Verify save was called
    }

    @Test
    void register_ShouldThrowException_WhenUserAlreadyExists() {
        // Arrange
        RegisterRequest req = RegisterRequest.builder().username("existingUser").password("password123").build();
        when(userRepository.existsByUsername(req.getUsername())).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(req));

        // Verify we never attempted to save
        verify(userRepository, never()).save(any());
    }

    // --- LOGIN TESTS ---

    @Test
    void login_ShouldReturnAuthRequest_WhenCredentialsAreValid() {
        // Arrange
        LoginRequest req =  LoginRequest.builder().username("validUser").password("password123").build();
        UserEntity user = UserEntity.builder().id(1L).username("validUser").password("encodedPass").build();

        when(userRepository.findByUsername(req.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(req.getPassword(), user.getPassword())).thenReturn(true);

        // Act
        AuthRequest response = authService.login(req);

        // Assert
        assertEquals("User logged in successfully.", response.getMessage()); // Assuming 'message' is a record component or getter
        assertEquals(1L, response.getUserId());
    }

    @Test
    void login_ShouldThrowException_WhenUserNotFound() {
        // Arrange
        LoginRequest req = LoginRequest.builder().username("unknownUser").password("pass").build();
        when(userRepository.findByUsername(req.getUsername())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> authService.login(req));
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsIncorrect() {
        // Arrange
        LoginRequest req = LoginRequest.builder().username("validUser").password("wrongPass").build();
        UserEntity user = UserEntity.builder().id(1L).username("validUser").password("encodedPass").build();

        when(userRepository.findByUsername(req.getUsername())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(req.getPassword(), user.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> authService.login(req));
    }

    // --- GET ALL USERS TEST ---

    @Test
    void getAllUsers_ShouldReturnListOfDtos() {
        // Arrange
        UserEntity user1 = UserEntity.builder().id(1L).username("u1").build();
        UserEntity user2 = UserEntity.builder().id(2L).username("u2").build();
        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        // Act
        List<UsersRequest> result = authService.getAllUsers();

        // Assert
        assertEquals(2, result.size());
        assertEquals("u1", result.get(0).getUsername()); // Assuming record or getter
    }
}