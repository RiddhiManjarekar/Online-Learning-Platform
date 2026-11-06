package com.learningplatform.controller;

import com.learningplatform.dto.LessonRequest;
import com.learningplatform.dto.LessonResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.LessonService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/courses")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    // Add lesson
    @PostMapping("/{courseId}/lessons")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonResponse createLesson(
            @PathVariable String courseId,
            @Valid @RequestBody LessonRequest request,
            @AuthenticationPrincipal User user
    ) {

        return lessonService.createLesson(
                courseId,
                request,
                user
        );
    }

    // Get lessons of a course
    @GetMapping("/{courseId}/lessons")
    public List<LessonResponse> getCourseLessons(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user
    ) {

        return lessonService.getCourseLessons(
                courseId,
                user
        );
    }

    // Update lesson
    @PutMapping("/lessons/{lessonId}")
    public LessonResponse updateLesson(
            @PathVariable String lessonId,
            @Valid @RequestBody LessonRequest request,
            @AuthenticationPrincipal User user
    ) {

        return lessonService.updateLesson(
                lessonId,
                request,
                user
        );
    }

    // Delete lesson
    @DeleteMapping("/lessons/{lessonId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(
            @PathVariable String lessonId,
            @AuthenticationPrincipal User user
    ) {

        lessonService.deleteLesson(lessonId, user);
    }
}