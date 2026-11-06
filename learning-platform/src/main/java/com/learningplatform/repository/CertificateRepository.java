
package com.learningplatform.repository;

import com.learningplatform.entity.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository
        extends MongoRepository<Certificate, String> {

    Optional<Certificate> findByLearnerIdAndCourseId(
            String learnerId,
            String courseId
    );

    List<Certificate> findByLearnerIdOrderByIssuedAtDesc(
            String learnerId
    );

    Optional<Certificate> findByCertificateNumber(
            String certificateNumber
    );
    List<Certificate> findAllByOrderByIssuedAtDesc();
}
