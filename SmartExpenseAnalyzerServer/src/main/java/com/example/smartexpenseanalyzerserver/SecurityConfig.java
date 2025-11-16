package com.example.smartexpenseanalyzerserver;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /**
     * Provides the PasswordEncoder bean for hashing passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures security rules.
     * We disable CSRF and allow all requests to our auth endpoints.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll() // Allow access to all auth endpoints
                        .requestMatchers("/api/users/**").permitAll()
                        .anyRequest().authenticated() // All other requests must be authenticated
                )
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin())); // For H2 console

        return http.build();
    }
}