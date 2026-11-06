
package com.learningplatform.service;

import com.learningplatform.dto.AdminDashboardStatsResponse;
import com.learningplatform.entity.Role;
import com.learningplatform.repository.CertificateRepository;
import com.learningplatform.repository.CourseRepository;
import com.learningplatform.repository.EnrollmentRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            CertificateRepository certificateRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
    }

    public AdminDashboardStatsResponse getDashboardStats() {

        long totalUsers = userRepository.count();

        long totalLearners = userRepository.countByRole(Role.LEARNER);
        long totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);

        long totalCourses = courseRepository.count();

        long publishedCourses = courseRepository.countByPublished(true);
        long unpublishedCourses = courseRepository.countByPublished(false);

        long totalEnrollments = enrollmentRepository.count();

        long totalCertificates = certificateRepository.count();

        return new AdminDashboardStatsResponse(
                totalUsers,
                totalLearners,
                totalInstructors,
                totalAdmins,
                totalCourses,
                publishedCourses,
                unpublishedCourses,
                totalEnrollments,
                totalCertificates
        );
    }
}
