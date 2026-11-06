
package com.learningplatform.repository;

import com.learningplatform.entity.CourseCategory;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CourseCategoryRepository
        extends MongoRepository<CourseCategory, String> {

    Optional<CourseCategory> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
