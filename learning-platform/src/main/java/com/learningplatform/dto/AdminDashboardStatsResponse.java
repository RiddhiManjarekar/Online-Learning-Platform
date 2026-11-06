
package com.learningplatform.dto;

public record AdminDashboardStatsResponse(
        long totalUsers,
        long totalLearners,
        long totalInstructors,
        long totalAdmins,
        long totalCourses,
        long publishedCourses,
        long unpublishedCourses,
        long totalEnrollments,
        long totalCertificates
) {
}
