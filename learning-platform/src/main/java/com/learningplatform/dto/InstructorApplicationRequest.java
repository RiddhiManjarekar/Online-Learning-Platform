
package com.learningplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InstructorApplicationRequest(

        @NotBlank(message = "Expertise is required")
        @Size(max = 120, message = "Expertise cannot exceed 120 characters")
        String expertise,

        @NotBlank(message = "Experience is required")
        @Size(max = 100, message = "Experience cannot exceed 100 characters")
        String experience,

        @NotBlank(message = "Course idea is required")
        @Size(max = 150, message = "Course idea cannot exceed 150 characters")
        String courseIdea,

        @NotBlank(message = "About information is required")
        @Size(max = 1500, message = "About information cannot exceed 1500 characters")
        String about

) {
}
