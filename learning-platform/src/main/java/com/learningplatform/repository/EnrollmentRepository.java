package com.learningplatform.repository;

import com.learningplatform.entity.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository
        extends MongoRepository<Enrollment, String> {

    Optional<Enrollment> findByLearnerIdAndCourseId(
            String learnerId,
            String courseId
    );

    List<Enrollment> findByLearnerIdOrderByEnrolledAtDesc(
            String learnerId
    );

    boolean existsByLearnerIdAndCourseId(
            String learnerId,
            String courseId
    );

    boolean existsByCourseId(String courseId);
    long countByCourseId(String courseId);

    List<Enrollment> findByCourseIdInOrderByEnrolledAtDesc(
            List<String> courseIds
    );

    List<Enrollment> findByCourseIdOrderByEnrolledAtDesc(
            String courseId
    );
}