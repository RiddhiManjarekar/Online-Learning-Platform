
package com.learningplatform.service;

import com.learningplatform.dto.AdminUserResponse;
import com.learningplatform.dto.UpdateUserRoleRequest;
import com.learningplatform.dto.UpdateUserStatusRequest;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AdminUserService(
            UserRepository userRepository,
            AuditLogService auditLogService) {

        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // Get all users, with optional search and role filtering
    public List<AdminUserResponse> getUsers(String search, Role role) {

        List<User> users;

        if (search != null && !search.isBlank()) {
            String keyword = search.trim();

            users = userRepository
                    .findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                            keyword,
                            keyword
                    );

        } else if (role != null) {
            users = userRepository.findByRole(role);

        } else {
            users = userRepository.findAll();
        }

        // Apply role filter as well when search is provided
        if (search != null && !search.isBlank() && role != null) {
            users = users.stream()
                    .filter(user -> user.getRole() == role)
                    .toList();
        }

        return users.stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get one user by ID
    public AdminUserResponse getUserById(String id) {

        User user = findUser(id);

        return convertToResponse(user);
    }

    // Change a user's role
    public AdminUserResponse updateUserRole(
            String id,
            UpdateUserRoleRequest request,
            Authentication authentication
    ) {

        User user = findUser(id);

        String currentAdminEmail = authentication.getName();

        // Prevent admin from changing their own role
        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot change your own admin role."
            );
        }

        // Capture the old role before updating
        Role oldRole = user.getRole();
        Role newRole = request.role();

        // Avoid unnecessary updates and duplicate audit records
        if (oldRole == newRole) {
            return convertToResponse(user);
        }

        user.setRole(newRole);

        User updatedUser = userRepository.save(user);

        // Record the role change
        auditLogService.logAction(
                "UPDATE_USER_ROLE",
                "USER",
                updatedUser.getId(),
                "User role changed from " + oldRole +
                        " to " + newRole
        );

        return convertToResponse(updatedUser);
    }

    // Activate or deactivate a user
    public AdminUserResponse updateUserStatus(
            String id,
            UpdateUserStatusRequest request,
            Authentication authentication
    ) {

        User user = findUser(id);

        String currentAdminEmail = authentication.getName();

        // Prevent admin from deactivating their own account
        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)
                && !request.enabled()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "You cannot deactivate your own account."
            );
        }

        // Capture the previous status
        boolean oldStatus = user.isEnabled();
        boolean newStatus = request.enabled();

        // Avoid unnecessary updates and duplicate audit records
        if (oldStatus == newStatus) {
            return convertToResponse(user);
        }

        user.setEnabled(newStatus);

        User updatedUser = userRepository.save(user);

        // Record activation or deactivation
        String action = newStatus
                ? "ACTIVATE_USER"
                : "DEACTIVATE_USER";

        String description = newStatus
                ? "User account activated."
                : "User account deactivated.";

        auditLogService.logAction(
                action,
                "USER",
                updatedUser.getId(),
                description
        );

        return convertToResponse(updatedUser);
    }

    private User findUser(String id) {

        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));
    }

    private AdminUserResponse convertToResponse(User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEnabled()
        );
    }
}
