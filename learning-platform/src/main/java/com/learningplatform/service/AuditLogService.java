
package com.learningplatform.service;

import com.learningplatform.entity.AuditLog;
import com.learningplatform.entity.User;
import com.learningplatform.repository.AuditLogRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public AuditLogService(
            AuditLogRepository auditLogRepository,
            UserRepository userRepository,
            MongoTemplate mongoTemplate
    ) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
    }

    // Record an action performed by the authenticated user.
    public void logAction(
            String action,
            String entityType,
            String entityId,
            String description
    ) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new IllegalStateException(
                    "Unable to identify the logged-in user."
            );
        }

        String email = authentication.getName()
                .trim()
                .toLowerCase(Locale.ROOT);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException(
                        "Logged-in user not found."
                ));

        AuditLog auditLog = new AuditLog(
                user.getId(),
                user.getName(),
                action,
                entityType,
                entityId,
                description
        );

        auditLogRepository.save(auditLog);
    }

    // Get all logs using pagination and optional filters.
    public Page<AuditLog> getFilteredLogs(
            String search,
            String performedById,
            String action,
            String entityType,
            int page,
            int size
    ) {

        // Validate pagination values.
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);

        Pageable pageable = PageRequest.of(
                safePage,
                safeSize,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        List<Criteria> criteriaList = new ArrayList<>();

        if (performedById != null && !performedById.isBlank()) {
            criteriaList.add(
                    Criteria.where("performedById").is(performedById.trim())
            );
        }

        if (action != null && !action.isBlank()) {
            criteriaList.add(
                    Criteria.where("action").is(action.trim())
            );
        }

        if (entityType != null && !entityType.isBlank()) {
            criteriaList.add(
                    Criteria.where("entityType").is(entityType.trim())
            );
        }

        if (search != null && !search.isBlank()) {

            String keyword = Pattern.quote(search.trim());

            Criteria searchCriteria = new Criteria().orOperator(
                    Criteria.where("performedByName")
                            .regex(keyword, "i"),
                    Criteria.where("action")
                            .regex(keyword, "i"),
                    Criteria.where("entityType")
                            .regex(keyword, "i"),
                    Criteria.where("entityId")
                            .regex(keyword, "i"),
                    Criteria.where("description")
                            .regex(keyword, "i")
            );

            criteriaList.add(searchCriteria);
        }

        Query query = new Query();

        if (!criteriaList.isEmpty()) {
            query.addCriteria(
                    new Criteria().andOperator(
                            criteriaList.toArray(new Criteria[0])
                    )
            );
        }

        // Count matching documents before applying pagination.
        long total = mongoTemplate.count(
                query,
                AuditLog.class
        );

        // Apply sorting, page number and page size.
        query.with(pageable);

        List<AuditLog> logs = mongoTemplate.find(
                query,
                AuditLog.class
        );

        return new PageImpl<>(logs, pageable, total);
    }

    // Find one audit log by ID.
    public AuditLog getLogById(String id) {

        return auditLogRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Audit log not found."
                ));
    }
}
