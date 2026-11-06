
package com.learningplatform.service;

import com.learningplatform.dto.PlatformSettingsRequest;
import com.learningplatform.entity.PlatformSettings;
import com.learningplatform.repository.PlatformSettingsRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PlatformSettingsService {

    private static final String SETTINGS_ID = "platform_settings";

    private final PlatformSettingsRepository settingsRepository;
    private final AuditLogService auditLogService;

    public PlatformSettingsService(
            PlatformSettingsRepository settingsRepository,
            AuditLogService auditLogService
    ) {
        this.settingsRepository = settingsRepository;
        this.auditLogService = auditLogService;
    }

    public PlatformSettings getSettings() {
        return settingsRepository.findById(SETTINGS_ID)
                .orElseGet(this::createDefaultSettings);
    }

    public PlatformSettings updateSettings(PlatformSettingsRequest request) {

        PlatformSettings settings = settingsRepository.findById(SETTINGS_ID)
                .orElseGet(this::createDefaultSettings);

        settings.setPlatformName(request.platformName().trim());
        settings.setDescription(
                request.description() == null
                        ? ""
                        : request.description().trim()
        );
        settings.setContactEmail(request.contactEmail().trim().toLowerCase());
        settings.setLogoUrl(
                request.logoUrl() == null ? "" : request.logoUrl().trim()
        );
        settings.setMaintenanceMode(request.maintenanceMode());
        settings.setUpdatedAt(LocalDateTime.now());

        PlatformSettings updated = settingsRepository.save(settings);

        auditLogService.logAction(
                "UPDATE_PLATFORM_SETTINGS",
                "PLATFORM_SETTINGS",
                updated.getId(),
                "Admin updated platform settings"
        );

        return updated;
    }

    private PlatformSettings createDefaultSettings() {

        PlatformSettings settings = new PlatformSettings(
                "LearnHub",
                "Online Learning Platform",
                "support@learnhub.com",
                "",
                false
        );

        settings.setId(SETTINGS_ID);
        settings.setUpdatedAt(LocalDateTime.now());

        return settingsRepository.save(settings);
    }
}
