package com.learningplatform.service;

import com.learningplatform.dto.LessonRequest;
import com.learningplatform.dto.LessonResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.Lesson;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.LessonRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final YouTubeUrlService youTubeUrlService;

    public LessonService(
            LessonRepository lessonRepository,
            CourseRepository courseRepository,
            YouTubeUrlService youTubeUrlService
    ) {
        this.lessonRepository = lessonRepository;
        this.courseRepository = courseRepository;
        this.youTubeUrlService = youTubeUrlService;
    }

    // Add a lesson to a course
    public LessonResponse createLesson(
            String courseId,
            LessonRequest request,
            User user
    ) {

        Course course = findCourse(courseId);
        checkOwnership(course, user);

        if (lessonRepository.existsByCourseIdAndOrderIndex(
                courseId,
                request.orderIndex()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A lesson with this order number already exists"
            );
        }

        Lesson lesson = new Lesson();

        lesson.setCourseId(courseId);

        applyRequest(lesson, request);

        Instant now = Instant.now();

        lesson.setCreatedAt(now);
        lesson.setUpdatedAt(now);

        return toResponse(lessonRepository.save(lesson));
    }

    // Get all lessons belonging to an instructor's course
    public List<LessonResponse> getCourseLessons(
            String courseId,
            User user
    ) {

        Course course = findCourse(courseId);
        checkOwnership(course, user);

        return lessonRepository
                .findByCourseIdOrderByOrderIndexAsc(courseId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Update a lesson
    public LessonResponse updateLesson(
            String lessonId,
            LessonRequest request,
            User user
    ) {

        Lesson lesson = findLesson(lessonId);

        Course course = findCourse(lesson.getCourseId());
        checkOwnership(course, user);

        boolean duplicateOrder =
                lessonRepository.existsByCourseIdAndOrderIndexAndIdNot(
                        lesson.getCourseId(),
                        request.orderIndex(),
                        lessonId
                );

        if (duplicateOrder) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A lesson with this order number already exists"
            );
        }

        applyRequest(lesson, request);
        lesson.setUpdatedAt(Instant.now());

        return toResponse(lessonRepository.save(lesson));
    }

    // Delete a lesson
    public void deleteLesson(String lessonId, User user) {

        Lesson lesson = findLesson(lessonId);

        Course course = findCourse(lesson.getCourseId());
        checkOwnership(course, user);

        lessonRepository.delete(lesson);
    }

    private Course findCourse(String courseId) {

        return courseRepository.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found"
                ));
    }

    private Lesson findLesson(String lessonId) {

        return lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Lesson not found"
                ));
    }

    private void checkOwnership(Course course, User user) {

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean isOwner =
                course.getInstructorId().equals(user.getId());

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to manage lessons in this course"
            );
        }
    }

    private void applyRequest(
            Lesson lesson,
            LessonRequest request
    ) {

        String videoId =
                youTubeUrlService.extractVideoId(request.youtubeUrl());

        lesson.setTitle(request.title().trim());

        String description = request.description();

        lesson.setDescription(
                description == null || description.isBlank()
                        ? null
                        : description.trim()
        );

        lesson.setYoutubeVideoId(videoId);
        lesson.setOrderIndex(request.orderIndex());
        lesson.setDurationSeconds(request.durationSeconds());
        lesson.setPreview(request.preview());
    }

    private LessonResponse toResponse(Lesson lesson) {

        String embedUrl =
                "https://www.youtube.com/embed/" +
                        lesson.getYoutubeVideoId();

        return new LessonResponse(
                lesson.getId(),
                lesson.getCourseId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getYoutubeVideoId(),
                embedUrl,
                lesson.getOrderIndex(),
                lesson.getDurationSeconds(),
                lesson.isPreview(),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt()
        );
    }
}