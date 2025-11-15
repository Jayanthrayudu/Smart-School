package com.smart_school.service;

import com.smart_school.model.SchoolClass;
import com.smart_school.repository.SchoolClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SchoolClassService {

    private final SchoolClassRepository classRepository;

    public SchoolClassService(SchoolClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    public List<SchoolClass> getAllClasses() {
        return classRepository.findAll();
    }

    public SchoolClass createClass(String name, String section, int capacity) {
        SchoolClass newClass = new SchoolClass();
        newClass.setName(name);
        newClass.setSection(section);
        newClass.setCapacity(capacity);
        return classRepository.save(newClass);
    }
 // com.smart_school.service.SchoolClassService.java


    public void deleteClassById(String id) {
        if (!classRepository.existsById(id)) {
            throw new RuntimeException("Class not found with ID: " + id);
        }
        classRepository.deleteById(id);
    }

}