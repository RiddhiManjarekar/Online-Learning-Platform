
package com.learningplatform.dto;

import java.time.LocalDateTime;

public record CourseCategoryResponse(
        String id,
        String name,
        String description,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
