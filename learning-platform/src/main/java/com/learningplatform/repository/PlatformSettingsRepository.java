
package com.learningplatform.repository;

import com.learningplatform.entity.PlatformSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlatformSettingsRepository
        extends MongoRepository<PlatformSettings, String> {
}
