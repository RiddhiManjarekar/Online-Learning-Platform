package com.learningplatform.controller;

import com.learningplatform.dto.CourseCategoryResponse;
import com.learningplatform.repository.CourseCategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CourseCategoryController {

    private final CourseCategoryRepository categoryRepository;

    public CourseCategoryController(
            CourseCategoryRepository categoryRepository
    ) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<CourseCategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(category -> new CourseCategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getDescription(),
                        category.getCreatedAt(),
                        category.getUpdatedAt()
                ))
                .toList();
    }
}