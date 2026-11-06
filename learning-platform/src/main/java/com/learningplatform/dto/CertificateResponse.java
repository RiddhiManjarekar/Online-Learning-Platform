
package com.learningplatform.dto;

import java.time.LocalDateTime;

public record CertificateResponse(
        String id,
        String certificateNumber,
        String courseId,
        String courseTitle,
        String learnerName,
        LocalDateTime issuedAt
) {
}
