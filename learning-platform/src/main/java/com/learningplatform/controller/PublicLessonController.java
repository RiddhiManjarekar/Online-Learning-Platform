package com.learningplatform.controller;

import com.learningplatform.dto.LearnerLessonResponse;
import com.learningplatform.service.LearnerCourseService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class PublicLessonController {

    private final LearnerCourseService learnerCourseService;

    public PublicLessonController(
            LearnerCourseService learnerCourseService
    ) {
        this.learnerCourseService = learnerCourseService;
    }

    // Public lesson list with preview access.
    @GetMapping("/{courseId}/lessons")
    public List<LearnerLessonResponse> getPublicLessons(
            @PathVariable String courseId
    ) {
        return learnerCourseService.getPublicLessons(courseId);
    }
}