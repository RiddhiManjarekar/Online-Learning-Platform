
package com.learningplatform.dto;

import java.time.LocalDateTime;

public record CertificateVerificationResponse(
        boolean valid,
        String certificateNumber,
        String learnerName,
        String courseTitle,
        LocalDateTime issuedAt
) {
}
