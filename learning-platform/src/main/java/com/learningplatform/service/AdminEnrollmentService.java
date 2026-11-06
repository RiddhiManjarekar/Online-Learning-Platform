
package com.learningplatform.service;

import com.learningplatform.dto.AdminEnrollmentResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminEnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final AuditLogService auditLogService;

    public AdminEnrollmentService(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            AuditLogService auditLogService
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.auditLogService = auditLogService;
    }

    // Get all enrollments with optional search and course filter.
    public List<AdminEnrollmentResponse> getAllEnrollments(
            String search,
            String courseId
    ) {
        List<Enrollment> enrollments = enrollmentRepository.findAll();

        return enrollments.stream()
                .map(this::toResponse)
                .filter(enrollment -> {

                    boolean matchesCourse =
                            courseId == null ||
                                    courseId.isBlank() ||
                                    enrollment.courseId().equals(courseId);

                    boolean matchesSearch =
                            search == null ||
                                    search.isBlank() ||
                                    enrollment.learnerName()
                                            .toLowerCase()
                                            .contains(search.trim().toLowerCase()) ||
                                    enrollment.learnerEmail()
                                            .toLowerCase()
                                            .contains(search.trim().toLowerCase()) ||
                                    enrollment.courseTitle()
                                            .toLowerCase()
                                            .contains(search.trim().toLowerCase());

                    return matchesCourse && matchesSearch;
                })
                .sorted((first, second) ->
                        second.enrolledAt().compareTo(first.enrolledAt())
                )
                .toList();
    }

    // Get details of one enrollment.
    public AdminEnrollmentResponse getEnrollmentById(String id) {

        Enrollment enrollment = findEnrollment(id);

        return toResponse(enrollment);
    }

    // Delete an enrollment without deleting its certificate.
    public void deleteEnrollment(String id) {

        Enrollment enrollment = findEnrollment(id);

        // Capture related information before deleting the enrollment.
        String learnerId = enrollment.getLearnerId();
        String courseId = enrollment.getCourseId();

        User learner = userRepository.findById(learnerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Learner associated with this enrollment was not found"
                ));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course associated with this enrollment was not found"
                ));

        // Delete enrollment first.
        enrollmentRepository.delete(enrollment);

        // Record the deletion.
        auditLogService.logAction(
                "DELETE_ENROLLMENT",
                "ENROLLMENT",
                enrollment.getId(),
                "Enrollment deleted for learner: " +
                        learner.getName() +
                        " (" + learner.getEmail() + ")" +
                        ", Course: " + course.getTitle()
        );
    }

    private Enrollment findEnrollment(String id) {

        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Enrollment not found"
                ));
    }

    private AdminEnrollmentResponse toResponse(
            Enrollment enrollment
    ) {

        User learner = userRepository.findById(
                enrollment.getLearnerId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Learner associated with this enrollment was not found"
        ));

        Course course = courseRepository.findById(
                enrollment.getCourseId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Course associated with this enrollment was not found"
        ));

        // Get the actual lessons belonging to this course.
        List<Lesson> lessons =
                lessonRepository.findByCourseIdOrderByOrderIndexAsc(
                        course.getId()
                );

        Set<String> lessonIds = lessons.stream()
                .map(Lesson::getId)
                .collect(Collectors.toSet());

        // Count only completed lessons that still belong to this course.
        long completedLessons = enrollment.getCompletedLessonIds()
                .stream()
                .filter(lessonIds::contains)
                .distinct()
                .count();

        int totalLessons = lessons.size();

        double progressPercentage = totalLessons == 0
                ? 0
                : (completedLessons * 100.0) / totalLessons;

        boolean completed = totalLessons > 0
                && completedLessons == totalLessons;

        return new AdminEnrollmentResponse(
                enrollment.getId(),
                learner.getId(),
                learner.getName(),
                learner.getEmail(),
                course.getId(),
                course.getTitle(),
                enrollment.getEnrolledAt(),
                totalLessons,
                (int) completedLessons,
                progressPercentage,
                completed
        );
    }
}
