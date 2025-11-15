package com.smart_school.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.smart_school.model.Course;
import java.util.List;
import java.util.Optional;


public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByStudentIdsContaining(String studentId);
    List<Course> findByTeacherId(String teacherId);

    List<Course> findByTeacherEmail(String teacherEmail);
    
    long countByTeacherId(String teacherId);
    long countByStudentIdsContaining(String studentId);
    
    List<Course> findByIsDefaultTrue();
    
    Optional<Course> findByNameIgnoreCase(String name);
}