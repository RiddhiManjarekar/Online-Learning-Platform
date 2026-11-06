
package com.learningplatform.service;

import com.learningplatform.dto.CourseCategoryRequest;
import com.learningplatform.dto.CourseCategoryResponse;
import com.learningplatform.entity.Course;
import com.learningplatform.entity.CourseCategory;
import com.learningplatform.repository.CourseCategoryRepository;
import com.learningplatform.repository.CourseRepository;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CourseCategoryService {

    private final CourseCategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final AuditLogService auditLogService;

    public CourseCategoryService(
            CourseCategoryRepository categoryRepository,
            CourseRepository courseRepository,
            AuditLogService auditLogService
    ) {
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.auditLogService = auditLogService;
    }

    // Create category
    public CourseCategoryResponse createCategory(
            CourseCategoryRequest request
    ) {
        String name = normalizeName(request.name());

        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }

        CourseCategory category = new CourseCategory(
                name,
                normalizeDescription(request.description())
        );

        try {
            CourseCategory saved = categoryRepository.save(category);

            auditLogService.logAction(
                    "CREATE_CATEGORY",
                    "CATEGORY",
                    saved.getId(),
                    "Category created: " + saved.getName()
            );

            return toResponse(saved);

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }
    }

    // Get all categories
    public List<CourseCategoryResponse> getAllCategories() {

        return categoryRepository
                .findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get category by ID
    public CourseCategoryResponse getCategoryById(String id) {

        return toResponse(findCategory(id));
    }

    // Update category
    public CourseCategoryResponse updateCategory(
            String id,
            CourseCategoryRequest request
    ) {
        CourseCategory category = findCategory(id);

        String oldName = category.getName();
        String newName = normalizeName(request.name());

        // Check whether another category already uses this name.
        if (!oldName.equalsIgnoreCase(newName)
                && categoryRepository.existsByNameIgnoreCase(newName)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }

        category.setName(newName);
        category.setDescription(
                normalizeDescription(request.description())
        );
        category.setUpdatedAt(LocalDateTime.now());

        try {
            CourseCategory updated = categoryRepository.save(category);

            // Update existing courses if the category name changed.
            if (!oldName.equals(newName)) {

                List<Course> courses =
                        courseRepository.findByCategoryIgnoreCase(oldName);

                for (Course course : courses) {
                    course.setCategory(newName);
                    course.setUpdatedAt(java.time.Instant.now());
                }

                if (!courses.isEmpty()) {
                    courseRepository.saveAll(courses);
                }
            }

            auditLogService.logAction(
                    "UPDATE_CATEGORY",
                    "CATEGORY",
                    updated.getId(),
                    "Category updated: " + oldName + " to " + newName
            );

            return toResponse(updated);

        } catch (DuplicateKeyException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }
    }

    // Delete category
    public void deleteCategory(String id) {

        CourseCategory category = findCategory(id);

        long courseCount =
                courseRepository.countByCategoryIgnoreCase(
                        category.getName()
                );

        if (courseCount > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete this category because "
                            + courseCount + " course(s) are using it"
            );
        }

        categoryRepository.delete(category);

        auditLogService.logAction(
                "DELETE_CATEGORY",
                "CATEGORY",
                id,
                "Category deleted: " + category.getName()
        );
    }

    private CourseCategory findCategory(String id) {

        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    private String normalizeName(String name) {
        return name.trim();
    }

    private String normalizeDescription(String description) {
        return description == null ? "" : description.trim();
    }

    private CourseCategoryResponse toResponse(CourseCategory category) {

        return new CourseCategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
