package com.learningplatform.dto;

import com.learningplatform.entity.Role;

public record UserResponse(
        String id,
        String name,
        String email,
        Role role
) {
}