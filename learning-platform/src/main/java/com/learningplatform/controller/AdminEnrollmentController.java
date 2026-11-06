
package com.learningplatform.controller;

import com.learningplatform.dto.AdminEnrollmentResponse;
import com.learningplatform.service.AdminEnrollmentService;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/enrollments")
public class AdminEnrollmentController {

    private final AdminEnrollmentService enrollmentService;

    public AdminEnrollmentController(
            AdminEnrollmentService enrollmentService
    ) {
        this.enrollmentService = enrollmentService;
    }

    // Get all enrollments with optional search and course filter.
    @GetMapping
    public List<AdminEnrollmentResponse> getAllEnrollments(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String courseId
    ) {
        return enrollmentService.getAllEnrollments(search, courseId);
    }

    // Get one enrollment's details.
    @GetMapping("/{id}")
    public AdminEnrollmentResponse getEnrollmentById(
            @PathVariable String id
    ) {
        return enrollmentService.getEnrollmentById(id);
    }

    // Delete an enrollment.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEnrollment(
            @PathVariable String id
    ) {
        enrollmentService.deleteEnrollment(id);
    }
}
