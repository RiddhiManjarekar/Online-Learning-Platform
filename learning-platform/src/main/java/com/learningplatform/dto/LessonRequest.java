package com.learningplatform.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LessonRequest(

        @NotBlank(message = "Lesson title is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        String title,

        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        String description,

        @NotBlank(message = "YouTube URL is required")
        String youtubeUrl,

        @NotNull(message = "Lesson order is required")
        @Min(value = 1, message = "Lesson order must be at least 1")
        Integer orderIndex,

        @Min(value = 1, message = "Duration must be greater than 0")
        Integer durationSeconds,

        boolean preview
) {}