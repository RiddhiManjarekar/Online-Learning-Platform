
package com.learningplatform.dto;

import java.time.Instant;

public record AdminEnrollmentResponse(
        String id,
        String learnerId,
        String learnerName,
        String learnerEmail,
        String courseId,
        String courseTitle,
        Instant enrolledAt,
        int totalLessons,
        int completedLessons,
        double progressPercentage,
        boolean completed
) {
}
