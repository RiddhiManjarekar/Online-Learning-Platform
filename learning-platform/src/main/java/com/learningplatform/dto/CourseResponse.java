
package com.learningplatform.dto;

import com.learningplatform.entity.CourseLevel;

import java.time.Instant;

public record CourseResponse(
        String id,
        String title,
        String description,
        String category,
        CourseLevel level,
        String thumbnailUrl,
        String instructorId,
        boolean published,
        Instant createdAt,
        Instant updatedAt
) {
}
