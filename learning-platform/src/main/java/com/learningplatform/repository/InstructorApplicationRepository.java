
package com.learningplatform.repository;

import com.learningplatform.entity.ApplicationStatus;
import com.learningplatform.entity.InstructorApplication;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface InstructorApplicationRepository
        extends MongoRepository<InstructorApplication, String> {

        boolean existsByUserIdAndStatus(
                String userId,
                ApplicationStatus status
        );

        List<InstructorApplication> findByUserIdOrderBySubmittedAtDesc(
                String userId
        );

        List<InstructorApplication> findAllByOrderBySubmittedAtDesc();

        Optional<InstructorApplication> findByIdAndUserId(
                String id,
                String userId
        );
}
