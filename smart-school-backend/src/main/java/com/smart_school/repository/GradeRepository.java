package com.smart_school.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smart_school.model.Grade;
import java.util.List;

public interface GradeRepository extends MongoRepository<Grade, String> {
    List<Grade> findByStudentId(String studentId);
    List<Grade> findByCourseId(String courseId);
}