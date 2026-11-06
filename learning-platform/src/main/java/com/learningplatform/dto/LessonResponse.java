package com.learningplatform.dto;

import java.time.Instant;

public record LessonResponse(
        String id,
        String courseId,
        String title,
        String description,
        String youtubeVideoId,
        String youtubeEmbedUrl,
        int orderIndex,
        Integer durationSeconds,
        boolean preview,
        Instant createdAt,
        Instant updatedAt
) {}