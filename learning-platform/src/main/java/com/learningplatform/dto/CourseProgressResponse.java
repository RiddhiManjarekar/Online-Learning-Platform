package com.learningplatform.dto;

public record CourseProgressResponse(
        String courseId,
        String courseTitle,
        int totalLessons,
        int completedLessons,
        double progressPercentage,
        boolean completed
) {
}