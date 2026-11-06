
package com.learningplatform.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "instructor_applications")
public class InstructorApplication {

    @Id
    private String id;

    private String userId;
    private String fullName;
    private String email;
    private String expertise;
    private String experience;
    private String courseIdea;
    private String about;

    private ApplicationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String reviewedBy;
    private String adminRemarks;

    public InstructorApplication() {
    }

    public InstructorApplication(
            String userId,
            String fullName,
            String email,
            String expertise,
            String experience,
            String courseIdea,
            String about
    ) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.expertise = expertise;
        this.experience = experience;
        this.courseIdea = courseIdea;
        this.about = about;
        this.status = ApplicationStatus.PENDING;
        this.submittedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getExpertise() {
        return expertise;
    }

    public String getExperience() {
        return experience;
    }

    public String getCourseIdea() {
        return courseIdea;
    }

    public String getAbout() {
        return about;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public String getAdminRemarks() {
        return adminRemarks;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public void setAdminRemarks(String adminRemarks) {
        this.adminRemarks = adminRemarks;
    }
}
