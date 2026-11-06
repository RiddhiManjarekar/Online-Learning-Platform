
package com.learningplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CourseCategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(max = 60, message = "Category name cannot exceed 60 characters")
        String name,

        @Size(max = 250, message = "Description cannot exceed 250 characters")
        String description

) {
}
