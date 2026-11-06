
package com.learningplatform.repository;

import com.learningplatform.entity.Course;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {

    List<Course> findByPublishedTrue(Sort sort);

    List<Course> findByInstructorId(String instructorId, Sort sort);

    // Used by InstructorEnrollmentService
    List<Course> findByInstructorId(String instructorId);

    long countByPublished(boolean published);

    List<Course> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String title,
            String category,
            Sort sort
    );

    long countByCategoryIgnoreCase(String category);

    List<Course> findByCategoryIgnoreCase(String category);

    Optional<Course> findByIdAndInstructorId(
            String id,
            String instructorId
    );
}
