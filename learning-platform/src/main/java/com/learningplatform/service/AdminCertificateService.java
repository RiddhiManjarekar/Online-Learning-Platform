package com.learningplatform.service;

import com.learningplatform.dto.AdminCertificateResponse;
import com.learningplatform.entity.Certificate;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CertificateRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
public class AdminCertificateService {

    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public AdminCertificateService(
            CertificateRepository certificateRepository,
            UserRepository userRepository,
            AuditLogService auditLogService) {

        this.certificateRepository = certificateRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    // Get all certificates with optional search and status filter.
    public List<AdminCertificateResponse> getAllCertificates(
            String search,
            Boolean revoked) {

        String searchText = search == null
                ? ""
                : search.trim().toLowerCase(Locale.ROOT);

        return certificateRepository.findAllByOrderByIssuedAtDesc()
                .stream()
                .filter(certificate ->
                        revoked == null ||
                                certificate.isRevoked() == revoked
                )
                .filter(certificate ->
                        matchesSearch(certificate, searchText)
                )
                .map(this::toResponse)
                .toList();
    }

    // Get one certificate by its ID.
    public AdminCertificateResponse getCertificateById(String id) {

        Certificate certificate = findCertificate(id);

        return toResponse(certificate);
    }

    // Revoke a certificate without deleting its record.
    public AdminCertificateResponse revokeCertificate(
            String id,
            String reason) {

        Certificate certificate = findCertificate(id);

        if (certificate.isRevoked()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This certificate has already been revoked."
            );
        }

        certificate.revoke(reason.trim());

        //Certificate saved = certificateRepository.save(certificate);

        Certificate savedCertificate =
                certificateRepository.save(certificate);

        auditLogService.logAction(
                "REVOKE_CERTIFICATE",
                "CERTIFICATE",
                savedCertificate.getId(),
                "Certificate revoked. Reason: " + reason.trim()
        );

        return toResponse(savedCertificate);

       // return toResponse(saved);
    }

    private boolean matchesSearch(
            Certificate certificate,
            String searchText) {

        if (searchText.isBlank()) {
            return true;
        }

        boolean matchesCertificate =
                contains(certificate.getCertificateNumber(), searchText);

        boolean matchesLearner =
                contains(certificate.getLearnerName(), searchText);

        boolean matchesCourse =
                contains(certificate.getCourseTitle(), searchText);

        // Find learner email using the learner ID.
        boolean matchesEmail = userRepository.findById(
                        certificate.getLearnerId()
                ).map(user -> contains(user.getEmail(), searchText))
                .orElse(false);

        return matchesCertificate ||
                matchesLearner ||
                matchesCourse ||
                matchesEmail;
    }

    private boolean contains(String value, String searchText) {
        return value != null &&
                value.toLowerCase(Locale.ROOT).contains(searchText);
    }

    private Certificate findCertificate(String id) {

        return certificateRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Certificate not found."
                ));
    }

    private AdminCertificateResponse toResponse(
            Certificate certificate) {

        String learnerEmail = userRepository
                .findById(certificate.getLearnerId())
                .map(User::getEmail)
                .orElse(null);

        return new AdminCertificateResponse(
                certificate.getId(),
                certificate.getCertificateNumber(),
                certificate.getLearnerId(),
                certificate.getLearnerName(),
                learnerEmail,
                certificate.getCourseId(),
                certificate.getCourseTitle(),
                certificate.getIssuedAt(),
                certificate.isRevoked(),
                certificate.getRevokedAt(),
                certificate.getRevocationReason()
        );
    }

    public Certificate getCertificateEntityById(String id) {
        return findCertificate(id);
    }

    public AdminCertificateResponse restoreCertificate(String id) {
        Certificate certificate = findCertificate(id);

        if (!certificate.isRevoked()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Certificate is not revoked."
            );
        }

        certificate.restore();

        Certificate savedCertificate =
                certificateRepository.save(certificate);

        auditLogService.logAction(
                "RESTORE_CERTIFICATE",
                "CERTIFICATE",
                savedCertificate.getId(),
                "Certificate restored: " +
                        savedCertificate.getCertificateNumber()
        );

        return toResponse(savedCertificate);
    }
}