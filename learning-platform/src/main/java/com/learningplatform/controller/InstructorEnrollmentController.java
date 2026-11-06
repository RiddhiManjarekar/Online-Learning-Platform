package com.learningplatform.controller;

import com.learningplatform.dto.InstructorEnrollmentResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.InstructorEnrollmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/enrollments")
public class InstructorEnrollmentController {

    private final InstructorEnrollmentService instructorEnrollmentService;

    public InstructorEnrollmentController(
            InstructorEnrollmentService instructorEnrollmentService
    ) {
        this.instructorEnrollmentService = instructorEnrollmentService;
    }

    // All learners enrolled in the instructor's courses
    @GetMapping
    public ResponseEntity<List<InstructorEnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal User instructor
    ) {
        return ResponseEntity.ok(
                instructorEnrollmentService.getMyEnrollments(instructor)
        );
    }

    // Learners enrolled in a particular course
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<InstructorEnrollmentResponse>> getCourseLearners(
            @PathVariable String courseId,
            @AuthenticationPrincipal User instructor
    ) {
        return ResponseEntity.ok(
                instructorEnrollmentService.getCourseLearners(
                        courseId,
                        instructor
                )
        );
    }

    // Individual learner's progress in a course
    @GetMapping("/course/{courseId}/learner/{learnerId}")
    public ResponseEntity<InstructorEnrollmentResponse> getLearnerProgress(
            @PathVariable String courseId,
            @PathVariable String learnerId,
            @AuthenticationPrincipal User instructor
    ) {
        return ResponseEntity.ok(
                instructorEnrollmentService.getLearnerProgress(
                        courseId,
                        learnerId,
                        instructor
                )
        );
    }
}