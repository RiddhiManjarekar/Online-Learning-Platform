
package com.learningplatform.controller;

import com.learningplatform.dto.CourseCategoryRequest;
import com.learningplatform.dto.CourseCategoryResponse;
import com.learningplatform.service.CourseCategoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCourseCategoryController {

    private final CourseCategoryService categoryService;

    public AdminCourseCategoryController(
            CourseCategoryService categoryService
    ) {
        this.categoryService = categoryService;
    }

    // Create category
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseCategoryResponse createCategory(
            @Valid @RequestBody CourseCategoryRequest request
    ) {
        return categoryService.createCategory(request);
    }

    // Get all categories
    @GetMapping
    public List<CourseCategoryResponse> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // Get category by ID
    @GetMapping("/{id}")
    public CourseCategoryResponse getCategoryById(
            @PathVariable String id
    ) {
        return categoryService.getCategoryById(id);
    }

    // Update category
    @PutMapping("/{id}")
    public CourseCategoryResponse updateCategory(
            @PathVariable String id,
            @Valid @RequestBody CourseCategoryRequest request
    ) {
        return categoryService.updateCategory(id, request);
    }

    // Delete category
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
    }
}
