package com.smart_school.repository;

import com.smart_school.model.Teacher;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    long countById(String teacherId); // optional
//    Teacher findByName(String name);
	Optional<Teacher> findByName(String name);
	

}