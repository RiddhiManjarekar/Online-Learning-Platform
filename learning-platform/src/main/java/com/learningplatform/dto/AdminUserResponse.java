package com.learningplatform.dto;

import com.learningplatform.entity.Role;

public record AdminUserResponse(
        String id,
        String name,
        String email,
        Role role,
        boolean enabled
) {
}