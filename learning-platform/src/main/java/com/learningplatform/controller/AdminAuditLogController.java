
package com.learningplatform.controller;

import com.learningplatform.entity.AuditLog;
import com.learningplatform.service.AuditLogService;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
public class AdminAuditLogController {

    private final AuditLogService auditLogService;

    public AdminAuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // Get audit logs with optional filters and pagination.
    @GetMapping
    public Page<AuditLog> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String performedById,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return auditLogService.getFilteredLogs(
                search,
                performedById,
                action,
                entityType,
                page,
                size
        );
    }

    // Get one audit log by ID.
    @GetMapping("/{id}")
    public AuditLog getAuditLogById(@PathVariable String id) {
        return auditLogService.getLogById(id);
    }
}
