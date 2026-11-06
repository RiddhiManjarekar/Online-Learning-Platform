
package com.learningplatform.controller;

import com.learningplatform.dto.PlatformSettingsRequest;
import com.learningplatform.entity.PlatformSettings;
import com.learningplatform.service.PlatformSettingsService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class AdminPlatformSettingsController {

    private final PlatformSettingsService settingsService;

    public AdminPlatformSettingsController(
            PlatformSettingsService settingsService
    ) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public PlatformSettings getSettings() {
        return settingsService.getSettings();
    }

    @PutMapping
    public PlatformSettings updateSettings(
            @Valid @RequestBody PlatformSettingsRequest request
    ) {
        return settingsService.updateSettings(request);
    }
}
