
package com.learningplatform.dto;

import com.learningplatform.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ApplicationReviewRequest(

        @NotNull(message = "Application status is required")
        ApplicationStatus status,

        @Size(max = 500, message = "Admin remarks cannot exceed 500 characters")
        String adminRemarks

) {
}
