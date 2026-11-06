
package com.learningplatform.service;

import com.learningplatform.dto.CourseRequest;
import com.learningplatform.dto.CourseResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.CourseCategory;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.LessonRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.CourseCategoryRepository;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseCategoryRepository categoryRepository;
    private final AuditLogService auditLogService;

    public CourseService(
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            EnrollmentRepository enrollmentRepository,
            CourseCategoryRepository categoryRepository,
            AuditLogService auditLogService) {

        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.categoryRepository = categoryRepository;
        this.auditLogService = auditLogService;
    }

    // Create a new course
    public CourseResponse createCourse(CourseRequest request, User user) {

        Course course = new Course();

        applyRequest(course, request);

        // Never trust an instructor ID sent by the client.
        course.setInstructorId(user.getId());
        course.setPublished(false);

        Instant now = Instant.now();
        course.setCreatedAt(now);
        course.setUpdatedAt(now);

        Course savedCourse = courseRepository.save(course);

        auditLogService.logAction(
                "CREATE_COURSE",
                "COURSE",
                savedCourse.getId(),
                "Course created: " + savedCourse.getTitle()
        );

        return toResponse(savedCourse);
    }

    public List<CourseResponse> getPublishedCourses() {

        return courseRepository
                .findByPublishedTrue(
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CourseResponse getPublishedCourse(String id) {

        Course course = findCourse(id);

        if (!course.isPublished()) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Course not found"
            );
        }

        return toResponse(course);
    }

    public List<CourseResponse> getMyCourses(User user) {

        return courseRepository
                .findByInstructorId(
                        user.getId(),
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Update an existing course
    public CourseResponse updateCourse(
            String id,
            CourseRequest request,
            User user
    ) {

        Course course = findCourse(id);

        checkOwnership(course, user);

        applyRequest(course, request);
        course.setUpdatedAt(Instant.now());

        Course updatedCourse = courseRepository.save(course);

        auditLogService.logAction(
                "UPDATE_COURSE",
                "COURSE",
                updatedCourse.getId(),
                "Course updated: " + updatedCourse.getTitle()
        );

        return toResponse(updatedCourse);
    }

    // Delete a course
    public void deleteCourse(String id, User user) {

        Course course = findCourse(id);

        checkOwnership(course, user);

        // Do not delete a course that has enrolled learners.
        if (enrollmentRepository.existsByCourseId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This course has enrolled learners and cannot be deleted"
            );
        }

        String courseTitle = course.getTitle();

        // Delete the course lessons first.
        lessonRepository.deleteByCourseId(id);

        // Then delete the course.
        courseRepository.delete(course);

        auditLogService.logAction(
                "DELETE_COURSE",
                "COURSE",
                id,
                "Course deleted: " + courseTitle
        );
    }

    private Course findCourse(String id) {

        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Course not found"
                ));
    }

    private void checkOwnership(Course course, User user) {

        boolean isAdmin = user.getRole() == Role.ADMIN;

        boolean isOwner = user.getId().equals(course.getInstructorId());

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to manage this course"
            );
        }
    }

    // Apply course request and validate its category.
    private void applyRequest(
            Course course,
            CourseRequest request
    ) {

        String categoryName = request.category();

        if (categoryName == null || categoryName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Course category is required"
            );
        }

        CourseCategory category = categoryRepository
                .findByNameIgnoreCase(categoryName.trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid course category. Please select a category created by the administrator."
                ));

        course.setTitle(request.title().trim());
        course.setDescription(request.description().trim());

        // Store the official category name from MongoDB.
        course.setCategory(category.getName());

        course.setLevel(request.level());

        String thumbnail = request.thumbnailUrl();

        course.setThumbnailUrl(
                thumbnail == null || thumbnail.isBlank()
                        ? null
                        : thumbnail.trim()
        );
    }

    private CourseResponse toResponse(Course course) {

        return new CourseResponse(
                course.getId(),
                course.getTitle(),
                course.getDescription(),
                course.getCategory(),
                course.getLevel(),
                course.getThumbnailUrl(),
                course.getInstructorId(),
                course.isPublished(),
                course.getCreatedAt(),
                course.getUpdatedAt()
        );
    }

    // Publish course
    public CourseResponse publishCourse(String id, User user) {

        Course course = findCourse(id);

        checkOwnership(course, user);

        long lessonCount = lessonRepository.countByCourseId(id);

        if (lessonCount == 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "A course must contain at least one lesson before publishing"
            );
        }

        if (course.isPublished()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Course is already published"
            );
        }

        course.setPublished(true);
        course.setUpdatedAt(Instant.now());

        Course publishedCourse = courseRepository.save(course);

        auditLogService.logAction(
                "PUBLISH_COURSE",
                "COURSE",
                publishedCourse.getId(),
                "Course published: " + publishedCourse.getTitle()
        );

        return toResponse(publishedCourse);
    }

    // Unpublish course
    public CourseResponse unpublishCourse(String id, User user) {

        Course course = findCourse(id);

        checkOwnership(course, user);

        if (!course.isPublished()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Course is already unpublished"
            );
        }

        course.setPublished(false);
        course.setUpdatedAt(Instant.now());

        Course unpublishedCourse = courseRepository.save(course);

        auditLogService.logAction(
                "UNPUBLISH_COURSE",
                "COURSE",
                unpublishedCourse.getId(),
                "Course unpublished: " + unpublishedCourse.getTitle()
        );

        return toResponse(unpublishedCourse);
    }

    // Get all courses for admin
    public List<CourseResponse> getAllCoursesForAdmin(
            String search,
            Boolean published
    ) {

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");

        List<Course> courses;

        if (search != null && !search.isBlank()) {

            String keyword = search.trim();

            courses = courseRepository
                    .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                            keyword,
                            keyword,
                            sort
                    );

        } else {
            courses = courseRepository.findAll(sort);
        }

        return courses.stream()
                .filter(course ->
                        published == null || course.isPublished() == published
                )
                .map(this::toResponse)
                .toList();
    }

    public CourseResponse getCourseForAdmin(String id) {

        Course course = findCourse(id);

        return toResponse(course);
    }
}
