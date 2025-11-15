package com.smart_school.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smart_school.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByName(String name);

    List<User> findByRole(String role); // ✅ used in DashboardService
    
    List<User> findByRoleIgnoreCase(String role);

}
	