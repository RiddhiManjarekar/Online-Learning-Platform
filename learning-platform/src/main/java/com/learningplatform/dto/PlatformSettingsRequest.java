
package com.learningplatform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PlatformSettingsRequest(

        @NotBlank(message = "Platform name is required")
        @Size(max = 100)
        String platformName,

        @Size(max = 500)
        String description,

        @NotBlank(message = "Contact email is required")
        @Email(message = "Enter a valid contact email")
        String contactEmail,

        String logoUrl,

        @NotNull(message = "Maintenance mode is required")
        Boolean maintenanceMode

) {
}
