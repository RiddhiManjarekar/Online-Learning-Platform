
package com.learningplatform.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "certificates")
@CompoundIndex(
        name = "learner_course_unique",
        def = "{'learnerId': 1, 'courseId': 1}",
        unique = true
)
public class Certificate {

    @Id
    private String id;

    @Indexed(unique = true)
    private String certificateNumber;

    private String learnerId;
    private String learnerName;
    private String courseId;
    private String courseTitle;
    private LocalDateTime issuedAt;

    // Revocation details
    private boolean revoked = false;
    private LocalDateTime revokedAt;
    private String revocationReason;

    public Certificate() {
    }

    public Certificate(
            String certificateNumber,
            String learnerId,
            String learnerName,
            String courseId,
            String courseTitle,
            LocalDateTime issuedAt) {

        this.certificateNumber = certificateNumber;
        this.learnerId = learnerId;
        this.learnerName = learnerName;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.issuedAt = issuedAt;
        this.revoked = false;
    }

    public String getId() {
        return id;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public String getLearnerId() {
        return learnerId;
    }

    public String getLearnerName() {
        return learnerName;
    }

    public String getCourseId() {
        return courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public LocalDateTime getIssuedAt() {
        return issuedAt;
    }

    public boolean isRevoked() {
        return revoked;
    }

    public LocalDateTime getRevokedAt() {
        return revokedAt;
    }

    public String getRevocationReason() {
        return revocationReason;
    }

    public void revoke(String reason) {
        this.revoked = true;
        this.revokedAt = LocalDateTime.now();
        this.revocationReason = reason;
    }

    public void restore() {
        this.revoked = false;
        this.revokedAt = null;
        this.revocationReason = null;
    }
}
