
package com.learningplatform.controller;

import com.learningplatform.dto.AdminDashboardStatsResponse;
import com.learningplatform.service.AdminDashboardService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DashboardController {

    private final AdminDashboardService adminDashboardService;

    public DashboardController(
            AdminDashboardService adminDashboardService
    ) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping("/learner/dashboard")
    public Map<String, String> learnerDashboard() {
        return Map.of(
                "message", "Welcome to the Learner Dashboard"
        );
    }

    @GetMapping("/instructor/dashboard")
    public Map<String, String> instructorDashboard() {
        return Map.of(
                "message", "Welcome to the Instructor Dashboard"
        );
    }

    @GetMapping("/admin/dashboard")
    public Map<String, String> adminDashboard() {
        return Map.of(
                "message", "Welcome to the Admin Dashboard"
        );
    }

    @GetMapping("/admin/dashboard/stats")
    public AdminDashboardStatsResponse getAdminDashboardStats() {
        return adminDashboardService.getDashboardStats();
    }
}
