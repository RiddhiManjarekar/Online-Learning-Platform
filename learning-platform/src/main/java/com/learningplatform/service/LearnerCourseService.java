package com.learningplatform.service;

import com.learningplatform.dto.CourseProgressResponse;
import com.learningplatform.dto.LearnerLessonResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.LessonRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.learningplatform.entity.Role;
import org.springframework.security.access.AccessDeniedException;

import java.util.ArrayList;
import java.util.List;

@Service
public class LearnerCourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;

    public LearnerCourseService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // Public lesson list.
    // Visitors can watch preview lessons only.
    public List<LearnerLessonResponse> getPublicLessons(
            String courseId
    ) {

        Course course = findPublishedCourse(courseId);

        List<Lesson> lessons =
                lessonRepository.findByCourseIdOrderByOrderIndexAsc(
                        course.getId()
                );

        return lessons.stream()
                .map(lesson -> toLessonResponse(
                        lesson,
                        lesson.isPreview(),
                        false
                ))
                .toList();
    }

    // Get all lessons for an enrolled learner.
    public List<LearnerLessonResponse> getEnrolledLessons(
            String courseId,
            User user
    ) {

        checkLearner(user);

        Course course = findCourse(courseId);

        Enrollment enrollment = findEnrollment(
                user.getId(),
                courseId
        );

        List<Lesson> lessons =
                lessonRepository.findByCourseIdOrderByOrderIndexAsc(
                        course.getId()
                );

        return lessons.stream()
                .map(lesson -> toLessonResponse(
                        lesson,
                        true,
                        enrollment.getCompletedLessonIds()
                                .contains(lesson.getId())
                ))
                .toList();
    }

    // Mark one lesson as completed.
    public CourseProgressResponse completeLesson(
            String courseId,
            String lessonId,
            User user
    ) {

        checkLearner(user);

        Course course = findCourse(courseId);

        Enrollment enrollment = findEnrollment(
                user.getId(),
                courseId
        );

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lesson not found"
                ));

        // Ensure the lesson belongs to the requested course.
        if (!lesson.getCourseId().equals(courseId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Lesson not found in this course"
            );
        }

        List<String> completedLessonIds =
                enrollment.getCompletedLessonIds();

        // Prevent duplicate completion entries.
        if (!completedLessonIds.contains(lessonId)) {

            completedLessonIds.add(lessonId);

            enrollment.setCompletedLessonIds(
                    completedLessonIds
            );

            enrollmentRepository.save(enrollment);
        }

        return calculateProgress(course, enrollment);
    }

    // Get current progress of one enrolled course.
    public CourseProgressResponse getCourseProgress(
            String courseId,
            User user
    ) {

        checkLearner(user);

        Course course = findCourse(courseId);

        Enrollment enrollment = findEnrollment(
                user.getId(),
                courseId
        );

        return calculateProgress(course, enrollment);
    }

    private CourseProgressResponse calculateProgress(
            Course course,
            Enrollment enrollment
    ) {

        int totalLessons = (int) lessonRepository.countByCourseId(
                course.getId()
        );

        int completedLessons =
                enrollment.getCompletedLessonIds().size();

        double percentage = totalLessons == 0
                ? 0
                : (completedLessons * 100.0) / totalLessons;

        boolean completed = totalLessons > 0
                && completedLessons == totalLessons;

        return new CourseProgressResponse(
                course.getId(),
                course.getTitle(),
                totalLessons,
                completedLessons,
                percentage,
                completed
        );
    }

    private LearnerLessonResponse toLessonResponse(
            Lesson lesson,
            boolean canWatch,
            boolean completed
    ) {

        boolean locked = !canWatch;

        String embedUrl = locked
                ? null
                : "https://www.youtube.com/embed/"
                + lesson.getYoutubeVideoId();

        return new LearnerLessonResponse(
                lesson.getId(),
                lesson.getCourseId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getOrderIndex(),
                lesson.getDurationSeconds(),
                lesson.isPreview(),
                locked,
                completed,
                embedUrl
        );
    }

    private Enrollment findEnrollment(
            String learnerId,
            String courseId
    ) {

        return enrollmentRepository
                .findByLearnerIdAndCourseId(
                        learnerId,
                        courseId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Please enroll in this course to access its lessons"
                ));
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

    private void checkLearner(User user) {

        if (user.getRole() != Role.LEARNER) {
            throw new AccessDeniedException(
                    "Only learners can access these features"
            );
        }
    }
}