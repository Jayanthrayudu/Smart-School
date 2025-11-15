package com.smart_school.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smart_school.model.Attendance;


import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByCourseId(String courseId);
    long countByCourseIdAndDate(String courseId, String date);

}