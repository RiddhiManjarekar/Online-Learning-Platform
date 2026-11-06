package com.learningplatform.controller;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.LoginRequest;
import com.learningplatform.dto.RegisterRequest;
import com.learningplatform.dto.UserResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.AuthService;
import com.learningplatform.dto.UpdateProfileRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.server.ResponseStatusException;
import com.learningplatform.dto.ChangePasswordRequest;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("REGISTER ENDPOINT REACHED");
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse currentUser(@AuthenticationPrincipal User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }


    @PutMapping("/profile")
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse updateProfile(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        return authService.updateProfile(user, request);
    }


    @PutMapping("/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public Map<String, String> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "User is not authenticated"
            );
        }

        authService.changePassword(user, request);

        return Map.of("message", "Password changed successfully");
    }


}