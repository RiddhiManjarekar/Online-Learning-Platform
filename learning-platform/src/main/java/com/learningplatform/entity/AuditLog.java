
package com.learningplatform.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {

    @Id
    private String id;

    private String performedById;
    private String performedByName;

    @Indexed
    private String action;

    @Indexed
    private String entityType;

    private String entityId;
    private String description;

    @Indexed
    private LocalDateTime createdAt;

    public AuditLog() {
    }

    public AuditLog(
            String performedById,
            String performedByName,
            String action,
            String entityType,
            String entityId,
            String description
    ) {
        this.performedById = performedById;
        this.performedByName = performedByName;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getPerformedById() {
        return performedById;
    }

    public String getPerformedByName() {
        return performedByName;
    }

    public String getAction() {
        return action;
    }

    public String getEntityType() {
        return entityType;
    }

    public String getEntityId() {
        return entityId;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
