package com.learningplatform.dto;

public record AuthResponse(
        String token,
        String tokenType,
        UserResponse user
) {
}