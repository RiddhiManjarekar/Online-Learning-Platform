
package com.learningplatform.controller;

import com.learningplatform.dto.CourseResponse;
import com.learningplatform.entity.User;
import com.learningplatform.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {

    private final CourseService courseService;

    public AdminCourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Get all courses with optional search and status filters.
    @GetMapping
    public List<CourseResponse> getAllCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean published
    ) {
        return courseService.getAllCoursesForAdmin(search, published);
    }

    // Get course details, including unpublished courses.
    @GetMapping("/{id}")
    public CourseResponse getCourseById(
            @PathVariable String id
    ) {
        return courseService.getCourseForAdmin(id);
    }

    // Publish a course.
    @PatchMapping("/{id}/publish")
    public CourseResponse publishCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return courseService.publishCourse(id, user);
    }

    // Unpublish a course.
    @PatchMapping("/{id}/unpublish")
    public CourseResponse unpublishCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return courseService.unpublishCourse(id, user);
    }

    // Delete a course.
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        courseService.deleteCourse(id, user);
    }
}
