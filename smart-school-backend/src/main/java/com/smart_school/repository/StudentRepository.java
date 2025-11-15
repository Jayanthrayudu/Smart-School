package com.smart_school.repository;

import com.smart_school.model.Student;


import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, String> {
    long countById(String studentId); // optional, in case needed
//    Optional<Student> findByName(String name);
    
}