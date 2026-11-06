
package com.learningplatform.dto;

import com.learningplatform.entity.CourseLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CourseRequest(

        @NotBlank(message = "Course title is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        String title,

        @NotBlank(message = "Course description is required")
        @Size(max = 5000, message = "Description cannot exceed 5000 characters")
        String description,

        @NotBlank(message = "Course category is required")
        @Size(max = 80, message = "Category cannot exceed 80 characters")
        String category,

        @NotNull(message = "Please select a course level")
        CourseLevel level,

        @Size(max = 1000, message = "Thumbnail URL is too long")
        String thumbnailUrl
) {
}
