package com.learningplatform.controller;

import com.learningplatform.dto.CourseProgressResponse;
import com.learningplatform.dto.LearnerLessonResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.LearnerCourseService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learner/courses")
public class LearnerCourseController {

    private final LearnerCourseService learnerCourseService;

    public LearnerCourseController(
            LearnerCourseService learnerCourseService
    ) {
        this.learnerCourseService = learnerCourseService;
    }

    // All lessons for an enrolled learner.
    @GetMapping("/{courseId}/lessons")
    public List<LearnerLessonResponse> getEnrolledLessons(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user
    ) {
        return learnerCourseService.getEnrolledLessons(
                courseId,
                user
        );
    }

    // Mark a lesson as completed.
    @PatchMapping("/{courseId}/lessons/{lessonId}/complete")
    public CourseProgressResponse completeLesson(
            @PathVariable String courseId,
            @PathVariable String lessonId,
            @AuthenticationPrincipal User user
    ) {
        return learnerCourseService.completeLesson(
                courseId,
                lessonId,
                user
        );
    }

    // Get course progress.
    @GetMapping("/{courseId}/progress")
    public CourseProgressResponse getCourseProgress(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user
    ) {
        return learnerCourseService.getCourseProgress(
                courseId,
                user
        );
    }
}