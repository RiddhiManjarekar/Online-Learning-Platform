
package com.learningplatform.controller;

import com.learningplatform.dto.ApplicationReviewRequest;
import com.learningplatform.dto.InstructorApplicationRequest;
import com.learningplatform.dto.InstructorApplicationResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.InstructorApplicationService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor-applications")
public class InstructorApplicationController {

        private final InstructorApplicationService applicationService;

        public InstructorApplicationController(
                InstructorApplicationService applicationService
        ) {
                this.applicationService = applicationService;
        }

        // POST /api/instructor-applications
        @PostMapping
        @PreAuthorize("hasRole('LEARNER')")
        public ResponseEntity<InstructorApplicationResponse> submitApplication(
                @AuthenticationPrincipal User user,
                @Valid @RequestBody InstructorApplicationRequest request
        ) {

                InstructorApplicationResponse response =
                        applicationService.submitApplication(user, request);

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(response);
        }

        // GET /api/instructor-applications/me
        @GetMapping("/me")
        @PreAuthorize("hasRole('LEARNER')")
        public ResponseEntity<List<InstructorApplicationResponse>> getMyApplications(
                @AuthenticationPrincipal User user
        ) {

                return ResponseEntity.ok(
                        applicationService.getMyApplications(user)
                );
        }

        // GET /api/instructor-applications/admin
        @GetMapping("/admin")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<InstructorApplicationResponse>> getAllApplications() {

                return ResponseEntity.ok(
                        applicationService.getAllApplications()
                );
        }

        // GET /api/instructor-applications/admin/{id}
        @GetMapping("/admin/{id}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<InstructorApplicationResponse> getApplicationById(
                @PathVariable String id
        ) {

                return ResponseEntity.ok(
                        applicationService.getApplicationById(id)
                );
        }

        // PATCH /api/instructor-applications/admin/{id}/review
        @PatchMapping("/admin/{id}/review")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<InstructorApplicationResponse> reviewApplication(
                @PathVariable String id,
                @Valid @RequestBody ApplicationReviewRequest request,
                @AuthenticationPrincipal User admin
        ) {

                return ResponseEntity.ok(
                        applicationService.reviewApplication(id, request, admin)
                );
        }
}
