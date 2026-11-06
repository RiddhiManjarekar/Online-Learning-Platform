package com.learningplatform.service;

import com.learningplatform.dto.InstructorEnrollmentResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Enrollment;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.User;
import com.learningplatform.entity.Role;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InstructorEnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    public InstructorEnrollmentService(
            EnrollmentRepository enrollmentRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            UserRepository userRepository
    ) {
        this.enrollmentRepository = enrollmentRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.userRepository = userRepository;
    }

    // Get enrollments across all courses owned by the instructor
    public List<InstructorEnrollmentResponse> getMyEnrollments(User instructor) {

        checkInstructor(instructor);

        List<Course> courses =
                courseRepository.findByInstructorId(instructor.getId());

        if (courses.isEmpty()) {
            return Collections.emptyList();
        }

        Map<String, Course> courseMap = courses.stream()
                .collect(Collectors.toMap(Course::getId, course -> course));

        List<String> courseIds = new ArrayList<>(courseMap.keySet());

        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseIdInOrderByEnrolledAtDesc(courseIds);

        return mapEnrollments(enrollments, courseMap);
    }

    // Get all learners enrolled in one instructor-owned course
    public List<InstructorEnrollmentResponse> getCourseLearners(
            String courseId,
            User instructor
    ) {
        checkInstructor(instructor);

        Course course = findInstructorCourse(courseId, instructor);

        List<Enrollment> enrollments =
                enrollmentRepository.findByCourseIdOrderByEnrolledAtDesc(courseId);

        Map<String, Course> courseMap = Map.of(course.getId(), course);

        return mapEnrollments(enrollments, courseMap);
    }

    // Get one learner's progress in one instructor-owned course
    public InstructorEnrollmentResponse getLearnerProgress(
            String courseId,
            String learnerId,
            User instructor
    ) {
        checkInstructor(instructor);

        Course course = findInstructorCourse(courseId, instructor);

        Enrollment enrollment = enrollmentRepository
                .findByLearnerIdAndCourseId(learnerId, courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Enrollment not found"
                ));

        User learner = findLearner(learnerId);

        Set<String> validLessonIds = getValidLessonIds(courseId);

        return toResponse(enrollment, course, learner, validLessonIds);
    }

    private List<InstructorEnrollmentResponse> mapEnrollments(
            List<Enrollment> enrollments,
            Map<String, Course> courseMap
    ) {
        if (enrollments.isEmpty()) {
            return Collections.emptyList();
        }

        // Load all required learners in one database call
        Set<String> learnerIds = enrollments.stream()
                .map(Enrollment::getLearnerId)
                .collect(Collectors.toSet());

        Map<String, User> learnerMap = new HashMap<>();

        userRepository.findAllById(learnerIds).forEach(
                learner -> learnerMap.put(learner.getId(), learner)
        );

        // Load valid lesson IDs once per course
        Map<String, Set<String>> lessonIdsByCourse = new HashMap<>();

        for (String courseId : courseMap.keySet()) {
            lessonIdsByCourse.put(courseId, getValidLessonIds(courseId));
        }

        List<InstructorEnrollmentResponse> responses = new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            Course course = courseMap.get(enrollment.getCourseId());

            if (course == null) {
                continue;
            }

            User learner = learnerMap.get(enrollment.getLearnerId());

            if (learner == null || learner.getRole() != Role.LEARNER) {
                continue;
            }

            Set<String> validLessonIds =
                    lessonIdsByCourse.getOrDefault(
                            course.getId(),
                            Collections.emptySet()
                    );

            responses.add(
                    toResponse(enrollment, course, learner, validLessonIds)
            );
        }

        return responses;
    }

    private InstructorEnrollmentResponse toResponse(
            Enrollment enrollment,
            Course course,
            User learner,
            Set<String> validLessonIds
    ) {
        // Count only completed lessons that still belong to this course
        Set<String> completedIds = enrollment.getCompletedLessonIds() == null
                ? Collections.emptySet()
                : new HashSet<>(enrollment.getCompletedLessonIds());

        completedIds.retainAll(validLessonIds);

        long totalLessons = validLessonIds.size();
        long completedLessons = completedIds.size();

        double progressPercentage = totalLessons == 0
                ? 0.0
                : Math.round((completedLessons * 100.0 / totalLessons) * 100.0) / 100.0;

        boolean completed = totalLessons > 0
                && completedLessons == totalLessons;

        return new InstructorEnrollmentResponse(
                enrollment.getId(),
                learner.getId(),
                learner.getName(),
                learner.getEmail(),
                course.getId(),
                course.getTitle(),
                course.getThumbnailUrl(),
                enrollment.getEnrolledAt(),
                totalLessons,
                completedLessons,
                progressPercentage,
                completed
        );
    }

    private Set<String> getValidLessonIds(String courseId) {

        List<Lesson> lessons =
                lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);

        return lessons.stream()
                .map(Lesson::getId)
                .collect(Collectors.toSet());
    }

    private Course findInstructorCourse(String courseId, User instructor) {

        return courseRepository.findByIdAndInstructorId(
                        courseId,
                        instructor.getId()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found"
                ));
    }

    private User findLearner(String learnerId) {

        User learner = userRepository.findById(learnerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Learner not found"
                ));

        if (learner.getRole() != Role.LEARNER) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Learner not found"
            );
        }

        return learner;
    }

    private void checkInstructor(User instructor) {

        if (instructor == null || instructor.getRole() != Role.INSTRUCTOR) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only instructors can access this resource"
            );
        }
    }
}