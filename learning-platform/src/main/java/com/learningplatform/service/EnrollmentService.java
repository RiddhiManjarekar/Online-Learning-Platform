
package com.learningplatform.service;

import com.learningplatform.dto.EnrollmentResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.LessonRepository;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
    }

    // Enroll the currently logged-in learner in a course.
    public EnrollmentResponse enroll(String courseId, User user) {

        checkLearner(user);

        // Only published courses can accept new enrollments.
        Course course = findPublishedCourse(courseId);

        // Prevent duplicate enrollment.
        if (enrollmentRepository.existsByLearnerIdAndCourseId(
                user.getId(),
                courseId
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You are already enrolled in this course"
            );
        }

        Enrollment enrollment = new Enrollment();

        enrollment.setLearnerId(user.getId());
        enrollment.setCourseId(courseId);
        enrollment.setEnrolledAt(Instant.now());

        try {
            Enrollment savedEnrollment =
                    enrollmentRepository.save(enrollment);

            return toResponse(savedEnrollment, course);

        } catch (DuplicateKeyException exception) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You are already enrolled in this course"
            );
        }
    }

    // Get all courses enrolled by the current learner.
    public List<EnrollmentResponse> getMyEnrollments(User user) {

        checkLearner(user);

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByLearnerIdOrderByEnrolledAtDesc(user.getId());

        return enrollments.stream()
                .map(enrollment -> {

                    Course course = courseRepository
                            .findById(enrollment.getCourseId())
                            .orElseThrow(() -> new ResponseStatusException(
                                    HttpStatus.NOT_FOUND,
                                    "Enrolled course no longer exists"
                            ));

                    return toResponse(enrollment, course);
                })
                .toList();
    }

    // Get enrollment information for one course.
    public EnrollmentResponse getMyEnrollment(
            String courseId,
            User user
    ) {

        checkLearner(user);

        // Do not require the course to remain published.
        Course course = findCourse(courseId);

        Enrollment enrollment = enrollmentRepository
                .findByLearnerIdAndCourseId(user.getId(), courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "You are not enrolled in this course"
                ));

        return toResponse(enrollment, course);
    }

    private void checkLearner(User user) {

        if (user.getRole() != Role.LEARNER) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only learners can access enrollment features"
            );
        }
    }

    private Course findPublishedCourse(String courseId) {

        Course course = findCourse(courseId);

        if (!course.isPublished()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found"
            );
        }

        return course;
    }

    private Course findCourse(String courseId) {

        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found"
                ));
    }

    private EnrollmentResponse toResponse(
            Enrollment enrollment,
            Course course
    ) {

        int totalLessons = (int) lessonRepository.countByCourseId(
                course.getId()
        );

        // Count only completed lessons that still exist.
        long completedLessons = enrollment.getCompletedLessonIds()
                .stream()
                .filter(lessonId ->
                        lessonRepository.existsById(lessonId)
                )
                .count();

        double progressPercentage = totalLessons == 0
                ? 0
                : (completedLessons * 100.0) / totalLessons;

        boolean completed = totalLessons > 0
                && completedLessons == totalLessons;

        return new EnrollmentResponse(
                enrollment.getId(),
                course.getId(),
                course.getTitle(),
                course.getThumbnailUrl(),
                enrollment.getEnrolledAt(),
                totalLessons,
                (int) completedLessons,
                progressPercentage,
                completed
        );
    }
}
