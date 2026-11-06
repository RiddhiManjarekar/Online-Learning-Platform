package com.learningplatform.controller;

import com.learningplatform.dto.AdminUserResponse;
import com.learningplatform.dto.UpdateUserRoleRequest;
import com.learningplatform.dto.UpdateUserStatusRequest;
import com.learningplatform.entity.Role;
import com.learningplatform.service.AdminUserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    // GET /api/admin/users
    // GET /api/admin/users?search=riddhi
    // GET /api/admin/users?role=INSTRUCTOR
    // GET /api/admin/users?search=gmail&role=LEARNER
    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role
    ) {

        return ResponseEntity.ok(
                adminUserService.getUsers(search, role)
        );
    }

    // GET /api/admin/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(
            @PathVariable String id
    ) {

        return ResponseEntity.ok(
                adminUserService.getUserById(id)
        );
    }

    // PATCH /api/admin/users/{id}/role
    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserResponse> updateUserRole(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRoleRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                adminUserService.updateUserRole(id, request, authentication)
        );
    }

    // PATCH /api/admin/users/{id}/status
    @PatchMapping("/{id}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable String id,
            @RequestBody UpdateUserStatusRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                adminUserService.updateUserStatus(id, request, authentication)
        );
    }
}