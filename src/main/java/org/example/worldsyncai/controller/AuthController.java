package org.example.worldsyncai.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.worldsyncai.dto.UserDto;
import org.example.worldsyncai.dto.auth.AuthResponse;
import org.example.worldsyncai.dto.auth.LoginRequest;
import org.example.worldsyncai.auth.JwtTokenProvider;
import org.example.worldsyncai.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * API for login (getting JWT)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenProvider.generateToken(authentication);

            log.info("✅ User '{}' logged in successfully.", request.getUsername());

            return ResponseEntity.ok(new AuthResponse(jwt));
        } catch (org.springframework.security.core.AuthenticationException e) {
            log.error("❌ Login failed for user '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        } catch (Exception e) {
            log.error("⚠️ Unexpected login error for user '{}': {}", request.getUsername(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed. Please try again.");
        }
    }

    /**
     * API for registering a new user
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UserDto userDto) {
        try {
            if (userService.existsByUsername(userDto.getUsername())) {
                log.error("❌ Registration error: Username '{}' is already taken!", userDto.getUsername());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already taken.");
            }

            if (userService.existsByEmail(userDto.getEmail())) {
                log.error("❌ Registration error: Email '{}' is already in use!", userDto.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is already in use.");
            }

            userService.addUser(userDto);

            return ResponseEntity.ok("User registered successfully");
        } catch (IllegalArgumentException e) {
            log.error("❌ Registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            log.error("⚠️ Unexpected registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Registration failed. Please try again.");
        }
    }

    /**
     * API to get the currently authenticated user
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
        }

        return ResponseEntity.ok(userService.getUserByUsername(authentication.getName()));
    }
}