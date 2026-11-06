package com.learningplatform.dto;

import java.time.Instant;

public record InstructorEnrollmentResponse(
        String id,
        String learnerId,
        String learnerName,
        String learnerEmail,
        String courseId,
        String courseTitle,
        String courseThumbnailUrl,
        Instant enrolledAt,
        long totalLessons,
        long completedLessons,
        double progressPercentage,
        boolean completed
) {}