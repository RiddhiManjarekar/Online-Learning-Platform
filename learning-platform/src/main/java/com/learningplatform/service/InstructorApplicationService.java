
package com.learningplatform.service;

import com.learningplatform.dto.ApplicationReviewRequest;
import com.learningplatform.dto.InstructorApplicationRequest;
import com.learningplatform.dto.InstructorApplicationResponse;
import com.learningplatform.entity.ApplicationStatus;
import com.learningplatform.entity.InstructorApplication;
import com.learningplatform.entity.Role;
import com.learningplatform.entity.User;
import com.learningplatform.repository.InstructorApplicationRepository;
import com.learningplatform.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InstructorApplicationService {

        private final InstructorApplicationRepository applicationRepository;
        private final UserRepository userRepository;

        public InstructorApplicationService(
                InstructorApplicationRepository applicationRepository,
                UserRepository userRepository
        ) {
                this.applicationRepository = applicationRepository;
                this.userRepository = userRepository;
        }

        // Learner submits an instructor application
        public InstructorApplicationResponse submitApplication(
                User authenticatedUser,
                InstructorApplicationRequest request
        ) {

                User user = userRepository.findById(authenticatedUser.getId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        ));

                if (user.getRole() != Role.LEARNER) {
                        throw new ResponseStatusException(
                                HttpStatus.FORBIDDEN,
                                "Only learners can apply to become instructors"
                        );
                }

                boolean alreadyPending =
                        applicationRepository.existsByUserIdAndStatus(
                                user.getId(),
                                ApplicationStatus.PENDING
                        );

                if (alreadyPending) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "You already have a pending instructor application"
                        );
                }

                InstructorApplication application = new InstructorApplication(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        request.expertise().trim(),
                        request.experience().trim(),
                        request.courseIdea().trim(),
                        request.about().trim()
                );

                InstructorApplication saved =
                        applicationRepository.save(application);

                return InstructorApplicationResponse.from(saved);
        }

        // Learner views their own application history
        public List<InstructorApplicationResponse> getMyApplications(
                User authenticatedUser
        ) {

                return applicationRepository
                        .findByUserIdOrderBySubmittedAtDesc(authenticatedUser.getId())
                        .stream()
                        .map(InstructorApplicationResponse::from)
                        .toList();
        }

        // Admin views all applications
        public List<InstructorApplicationResponse> getAllApplications() {

                return applicationRepository
                        .findAllByOrderBySubmittedAtDesc()
                        .stream()
                        .map(InstructorApplicationResponse::from)
                        .toList();
        }

        // Admin views one application
        public InstructorApplicationResponse getApplicationById(String id) {

                InstructorApplication application =
                        applicationRepository.findById(id)
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Instructor application not found"
                                ));

                return InstructorApplicationResponse.from(application);
        }

        // Admin approves or rejects an application
        public InstructorApplicationResponse reviewApplication(
                String applicationId,
                ApplicationReviewRequest request,
                User admin
        ) {

                if (request.status() != ApplicationStatus.APPROVED
                        && request.status() != ApplicationStatus.REJECTED) {

                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Review status must be APPROVED or REJECTED"
                        );
                }

                InstructorApplication application =
                        applicationRepository.findById(applicationId)
                                .orElseThrow(() -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Instructor application not found"
                                ));

                if (application.getStatus() != ApplicationStatus.PENDING) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "This application has already been reviewed"
                        );
                }

                User applicant = userRepository.findById(application.getUserId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Applicant user account not found"
                        ));

                if (request.status() == ApplicationStatus.APPROVED) {

                        if (applicant.getRole() != Role.LEARNER) {
                                throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Only learner accounts can be approved for instructor access"
                                );
                        }

                        applicant.setRole(Role.INSTRUCTOR);
                        userRepository.save(applicant);
                }

                application.setStatus(request.status());
                application.setReviewedAt(LocalDateTime.now());
                application.setReviewedBy(admin.getEmail());
                application.setAdminRemarks(
                        request.adminRemarks() == null
                                ? null
                                : request.adminRemarks().trim()
                );

                InstructorApplication saved =
                        applicationRepository.save(application);

                return InstructorApplicationResponse.from(saved);
        }
}
