
package com.learningplatform.service;

import com.learningplatform.dto.AuthResponse;
import com.learningplatform.dto.LoginRequest;
import com.learningplatform.dto.RegisterRequest;
import com.learningplatform.dto.UserResponse;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.UserRepository;
import com.learningplatform.security.JwtService;
import com.learningplatform.dto.UpdateProfileRequest;
import com.learningplatform.dto.ChangePasswordRequest;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email is already registered"
            );
        }

        User user = new User(
                request.name().trim(),
                email,
                passwordEncoder.encode(request.password()),
                Role.LEARNER
        );

        try {
            user = userRepository.save(user);
            System.out.println("USER SAVED SUCCESSFULLY!");
            System.out.println("GENERATED USER ID: " + user.getId());

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email is already registered"
            );
        }

        return createAuthResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            email, request.password()
                    )
            );
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid email or password"
            );
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Invalid email or password"
                ));

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return new AuthResponse(
                jwtService.generateToken(user),
                "Bearer",
                userResponse
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }


    public UserResponse updateProfile(User currentUser, UpdateProfileRequest request) {

        String name = request.name().trim();
        String email = normalizeEmail(request.email());

        // Check whether another user already uses this email
        if (userRepository.existsByEmailAndIdNot(email, currentUser.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }

        currentUser.setName(name);
        currentUser.setEmail(email);

        try {
            User updatedUser = userRepository.save(currentUser);

            return new UserResponse(
                    updatedUser.getId(),
                    updatedUser.getName(),
                    updatedUser.getEmail(),
                    updatedUser.getRole()
            );

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email is already registered"
            );
        }
    }


    public void changePassword(User currentUser, ChangePasswordRequest request) {

        // 1. Verify the current password
        if (!passwordEncoder.matches(
                request.currentPassword(),
                currentUser.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current password is incorrect"
            );
        }

        // 2. Check whether new password and confirmation match
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password and confirm password do not match"
            );
        }

        // 3. Prevent reusing the current password
        if (passwordEncoder.matches(
                request.newPassword(),
                currentUser.getPassword()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "New password must be different from current password"
            );
        }

        // 4. Encode and save the new password
        currentUser.setPassword(
                passwordEncoder.encode(request.newPassword())
        );

        userRepository.save(currentUser);
    }


}
