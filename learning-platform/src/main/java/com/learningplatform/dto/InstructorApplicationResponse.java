
package com.learningplatform.dto;

import com.learningplatform.entity.ApplicationStatus;
import com.learningplatform.entity.InstructorApplication;

import java.time.LocalDateTime;

public record InstructorApplicationResponse(
        String id,
        String userId,
        String fullName,
        String email,
        String expertise,
        String experience,
        String courseIdea,
        String about,
        ApplicationStatus status,
        LocalDateTime submittedAt,
        LocalDateTime reviewedAt,
        String reviewedBy,
        String adminRemarks
) {

        public static InstructorApplicationResponse from(
                InstructorApplication application
        ) {
                return new InstructorApplicationResponse(
                        application.getId(),
                        application.getUserId(),
                        application.getFullName(),
                        application.getEmail(),
                        application.getExpertise(),
                        application.getExperience(),
                        application.getCourseIdea(),
                        application.getAbout(),
                        application.getStatus(),
                        application.getSubmittedAt(),
                        application.getReviewedAt(),
                        application.getReviewedBy(),
                        application.getAdminRemarks()
                );
        }
}
