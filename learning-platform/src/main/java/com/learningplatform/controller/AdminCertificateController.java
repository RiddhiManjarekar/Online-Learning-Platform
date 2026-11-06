package com.learningplatform.controller;

import com.learningplatform.dto.AdminCertificateResponse;
import com.learningplatform.dto.RevokeCertificateRequest;
import com.learningplatform.entity.Certificate;
import com.learningplatform.service.AdminCertificateService;
import com.learningplatform.service.CertificatePdfService;
import jakarta.validation.Valid;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/api/admin/certificates")
public class AdminCertificateController {

    private final AdminCertificateService adminCertificateService;
    private final CertificatePdfService pdfService;


    public AdminCertificateController(
            AdminCertificateService adminCertificateService,
            CertificatePdfService pdfService) {

        this.adminCertificateService = adminCertificateService;
        this.pdfService = pdfService;
    }

    // Get all certificates with optional search and revoked filter.
    @GetMapping
    public ResponseEntity<List<AdminCertificateResponse>> getAllCertificates(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean revoked) {

        return ResponseEntity.ok(
                adminCertificateService.getAllCertificates(search, revoked)
        );
    }

    // Get certificate details.
    @GetMapping("/{id}")
    public ResponseEntity<AdminCertificateResponse> getCertificateById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                adminCertificateService.getCertificateById(id)
        );
    }

    // Download any certificate PDF as admin.
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadCertificate(
            @PathVariable String id) {

        // The admin service checks that the certificate exists.
        // The PDF service uses the certificate data to generate the file.
        // We fetch the entity through the repository-backed service below.
        Certificate certificate =
                adminCertificateService.getCertificateEntityById(id);

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

    // Revoke a certificate.
    @PatchMapping("/{id}/revoke")
    public ResponseEntity<AdminCertificateResponse> revokeCertificate(
            @PathVariable String id,
            @Valid @RequestBody RevokeCertificateRequest request) {

        return ResponseEntity.ok(
                adminCertificateService.revokeCertificate(
                        id,
                        request.reason()
                )
        );
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<AdminCertificateResponse> restoreCertificate(
            @PathVariable String id) {

        return ResponseEntity.ok(
                adminCertificateService.restoreCertificate(id)
        );
    }
}