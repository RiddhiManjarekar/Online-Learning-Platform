
package com.learningplatform.controller;

import com.learningplatform.dto.CourseRequest;
import com.learningplatform.dto.CourseResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Public catalogue: published courses only.
    @GetMapping("/courses")
    public List<CourseResponse> getPublishedCourses() {
        return courseService.getPublishedCourses();
    }

    // Public course details: published courses only.
    @GetMapping("/courses/{id}")
    public CourseResponse getPublishedCourse(
            @PathVariable String id
    ) {
        return courseService.getPublishedCourse(id);
    }

    // Instructor or admin creates a draft.
    @PostMapping("/instructor/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse createCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User user
    ) {
        return courseService.createCourse(request, user);
    }

    // Lists courses belonging to the current user.
    @GetMapping("/instructor/courses/me")
    public List<CourseResponse> getMyCourses(
            @AuthenticationPrincipal User user
    ) {
        return courseService.getMyCourses(user);
    }

    // Update an existing course.
    @PutMapping("/instructor/courses/{id}")
    public CourseResponse updateCourse(
            @PathVariable String id,
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal User user
    ) {
        return courseService.updateCourse(id, request, user);
    }

    // Delete an existing course.
    @DeleteMapping("/instructor/courses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        courseService.deleteCourse(id, user);
    }

    // Publish course
    @PatchMapping("/instructor/courses/{id}/publish")
    public CourseResponse publishCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return courseService.publishCourse(id, user);
    }


    // Unpublish course
    @PatchMapping("/instructor/courses/{id}/unpublish")
    public CourseResponse unpublishCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return courseService.unpublishCourse(id, user);
    }
}
