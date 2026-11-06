package com.learningplatform.dto;

import java.time.Instant;

public record EnrollmentResponse(
        String id,
        String courseId,
        String courseTitle,
        String courseThumbnailUrl,
        Instant enrolledAt,
        int totalLessons,
        int completedLessons,
        double progressPercentage,
        boolean completed
) {
}