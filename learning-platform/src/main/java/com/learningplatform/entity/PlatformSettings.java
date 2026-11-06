
package com.learningplatform.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "platform_settings")
public class PlatformSettings {

    @Id
    private String id;

    private String platformName;
    private String description;
    private String contactEmail;
    private String logoUrl;
    private boolean maintenanceMode = false;

    private LocalDateTime updatedAt;

    public PlatformSettings() {
    }

    public PlatformSettings(
            String platformName,
            String description,
            String contactEmail,
            String logoUrl,
            boolean maintenanceMode
    ) {
        this.platformName = platformName;
        this.description = description;
        this.contactEmail = contactEmail;
        this.logoUrl = logoUrl;
        this.maintenanceMode = maintenanceMode;
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getPlatformName() {
        return platformName;
    }

    public String getDescription() {
        return description;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public boolean isMaintenanceMode() {
        return maintenanceMode;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPlatformName(String platformName) {
        this.platformName = platformName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public void setMaintenanceMode(boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
