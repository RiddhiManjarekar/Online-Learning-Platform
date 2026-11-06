package com.learningplatform.controller;

import com.learningplatform.dto.EnrollmentResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.EnrollmentService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    // Enroll in a course.
    @PostMapping("/{courseId}")
    @ResponseStatus(HttpStatus.CREATED)
    public EnrollmentResponse enroll(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user
    ) {
        return enrollmentService.enroll(courseId, user);
    }

    // Get all courses enrolled by the current learner.
    @GetMapping
    public List<EnrollmentResponse> getMyEnrollments(
            @AuthenticationPrincipal User user
    ) {
        return enrollmentService.getMyEnrollments(user);
    }

    // Get enrollment information for one course.
    @GetMapping("/{courseId}")
    public EnrollmentResponse getMyEnrollment(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user
    ) {
        return enrollmentService.getMyEnrollment(courseId, user);
    }
}