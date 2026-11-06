
package com.learningplatform.controller;

import com.learningplatform.dto.CertificateResponse;
import com.learningplatform.dto.CertificateVerificationResponse;
import com.learningplatform.entity.Certificate;
import com.learningplatform.entity.User;
import com.learningplatform.service.CertificatePdfService;
import com.learningplatform.service.CertificateService;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api")
public class CertificateController {

    private final CertificateService certificateService;
    private final CertificatePdfService pdfService;

    public CertificateController(
            CertificateService certificateService,
            CertificatePdfService pdfService) {

        this.certificateService = certificateService;
        this.pdfService = pdfService;
    }

    // Generate a certificate after course completion.
    @PostMapping("/learner/certificates/courses/{courseId}")
    public ResponseEntity<CertificateResponse> generateCertificate(
            @PathVariable String courseId,
            @AuthenticationPrincipal User user) {

        CertificateResponse response =
                certificateService.generateCertificate(courseId, user);

        return ResponseEntity.ok(response);
    }

    // Get all certificates belonging to the logged-in learner.
    @GetMapping("/learner/certificates")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(
            @AuthenticationPrincipal User user) {

        return ResponseEntity.ok(
                certificateService.getMyCertificates(user)
        );
    }

    // Download a certificate as PDF.
    @GetMapping("/learner/certificates/{certificateId}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable String certificateId,
            @AuthenticationPrincipal User user) {

        Certificate certificate =
                certificateService.getCertificate(certificateId, user);

        byte[] pdf = pdfService.generatePdf(certificate);

        String filename = "certificate-" +
                certificate.getCertificateNumber() + ".pdf";

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename(filename, StandardCharsets.UTF_8)
                        .build()
        );

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }

    // Public certificate verification.
    @GetMapping("/certificates/verify/{certificateNumber}")
    public ResponseEntity<CertificateVerificationResponse> verifyCertificate(
            @PathVariable String certificateNumber) {

        return ResponseEntity.ok(
                certificateService.verifyCertificate(certificateNumber)
        );
    }
}
