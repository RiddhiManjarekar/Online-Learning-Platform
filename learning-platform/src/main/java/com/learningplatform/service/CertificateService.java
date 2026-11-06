
package com.learningplatform.service;

import com.learningplatform.dto.CertificateResponse;
import com.learningplatform.dto.CertificateVerificationResponse;
import com.learningplatform.entity.Certificate;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CertificateRepository;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.LessonRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;

    public CertificateService(
            CertificateRepository certificateRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository) {

        this.certificateRepository = certificateRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
    }

    public CertificateResponse generateCertificate(
            String courseId,
            User user) {

        checkLearner(user);

        // Return an existing certificate if already issued.
        var existing = certificateRepository
                .findByLearnerIdAndCourseId(user.getId(), courseId);

        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        // Verify enrollment.
        Enrollment enrollment = enrollmentRepository
                .findByLearnerIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "You are not enrolled in this course."
                ));

        // Find course.
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found."
                ));

        // Get the current lessons.
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);

        if (lessons.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This course has no lessons."
            );
        }

        // Compare completed lesson IDs with current lesson IDs.
        Set<String> completedIds = new HashSet<>(
                enrollment.getCompletedLessonIds()
        );

        boolean allCompleted = lessons.stream()
                .allMatch(lesson -> completedIds.contains(lesson.getId()));

        if (!allCompleted) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Complete all course lessons before requesting a certificate."
            );
        }

        String certificateNumber =
                "LH-" + UUID.randomUUID().toString().toUpperCase();

        Certificate certificate = new Certificate(
                certificateNumber,
                user.getId(),
                user.getName(),
                course.getId(),
                course.getTitle(),
                LocalDateTime.now()
        );

        Certificate saved = certificateRepository.save(certificate);

        return toResponse(saved);
    }

    public List<CertificateResponse> getMyCertificates(User user) {

        checkLearner(user);

        return certificateRepository
                .findByLearnerIdOrderByIssuedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Certificate getCertificate(
            String certificateId,
            User user) {

        checkLearner(user);

        Certificate certificate = certificateRepository
                .findById(certificateId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Certificate not found."
                ));

        if (!certificate.getLearnerId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot access another learner's certificate."
            );
        }

        return certificate;
    }


    public CertificateVerificationResponse verifyCertificate(
            String certificateNumber) {

        Certificate certificate = certificateRepository
                .findByCertificateNumber(certificateNumber)
                .orElse(null);

        if (certificate == null) {
            return new CertificateVerificationResponse(
                    false, certificateNumber, null, null, null
            );
        }

        return new CertificateVerificationResponse(
                !certificate.isRevoked(),
                certificate.getCertificateNumber(),
                certificate.getLearnerName(),
                certificate.getCourseTitle(),
                certificate.getIssuedAt()
        );
    }


    private void checkLearner(User user) {
        if (user.getRole() != Role.LEARNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only learners can access certificates."
            );
        }
    }

    private CertificateResponse toResponse(Certificate certificate) {
        return new CertificateResponse(
                certificate.getId(),
                certificate.getCertificateNumber(),
                certificate.getCourseId(),
                certificate.getCourseTitle(),
                certificate.getLearnerName(),
                certificate.getIssuedAt()
        );
    }
}
