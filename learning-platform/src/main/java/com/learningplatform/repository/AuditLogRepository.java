
package com.learningplatform.repository;

import com.learningplatform.entity.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuditLogRepository
        extends MongoRepository<AuditLog, String> {
}
