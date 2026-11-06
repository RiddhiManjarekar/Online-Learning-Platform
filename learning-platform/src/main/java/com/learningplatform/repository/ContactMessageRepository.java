
package com.learningplatform.repository;

import com.learningplatform.entity.ContactMessage;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactMessageRepository
        extends MongoRepository<ContactMessage, String> {
}
