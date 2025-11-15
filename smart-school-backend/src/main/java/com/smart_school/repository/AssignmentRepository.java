package com.smart_school.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smart_school.model.Assignment;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByCourseId(String courseId);
    List<Assignment> findByTeacherId(String teacherId);
    long countByTeacherIdAndGradedFalse(String teacherId);
    
    Optional<Assignment> findByTitle(String title);
}