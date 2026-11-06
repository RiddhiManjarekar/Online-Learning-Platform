package com.learningplatform.dto;

public record LearnerLessonResponse(
        String id,
        String courseId,
        String title,
        String description,
        int orderIndex,
        Integer durationSeconds,
        boolean preview,
        boolean locked,
        boolean completed,
        String embedUrl
) {
}