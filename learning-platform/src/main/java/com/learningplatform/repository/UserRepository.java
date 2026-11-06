package com.learningplatform.repository;

import com.learningplatform.entity.User;
import com.learningplatform.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    List<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String name,
            String email
    );

    List<User> findByRole(Role role);

    boolean existsByEmailAndIdNot(String email, String id);
}