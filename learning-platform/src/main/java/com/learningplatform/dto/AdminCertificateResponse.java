package com.learningplatform.dto;

import java.time.LocalDateTime;

public record AdminCertificateResponse(
        String id,
        String certificateNumber,
        String learnerId,
        String learnerName,
        String learnerEmail,
        String courseId,
        String courseTitle,
        LocalDateTime issuedAt,
        boolean revoked,
        LocalDateTime revokedAt,
        String revocationReason
) {
}