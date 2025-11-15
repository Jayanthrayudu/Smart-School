package com.smart_school.service;

import com.smart_school.DTO.GradeDTO;
import com.smart_school.model.Assignment;
import com.smart_school.model.Course;
import com.smart_school.model.Grade;
import com.smart_school.model.User;
import com.smart_school.repository.AssignmentRepository;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.GradeRepository;
import com.smart_school.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GradeService {

    private final GradeRepository gradeRepository;
    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public GradeService(GradeRepository gradeRepository,
                        AssignmentRepository assignmentRepository,
                        CourseRepository courseRepository,
                        UserRepository userRepository) {
        this.gradeRepository = gradeRepository;
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    public List<GradeDTO> getStudentGrades(String email) {
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Student not found with email: " + email));

        return gradeRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToGradeDTO)
                .collect(Collectors.toList());
    }

    public List<GradeDTO> getTeacherGrades(String email) {
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Teacher not found with email: " + email));

        List<Course> courses = courseRepository.findByTeacherId(teacher.getId());
        return courses.stream()
                .flatMap(course -> gradeRepository.findByCourseId(course.getId()).stream())
                .map(this::mapToGradeDTO)
                .collect(Collectors.toList());
    }

    public GradeDTO submitGrade(GradeDTO gradeDTO) {
        // 🔹 Lookup Student by Name
        User student = userRepository.findByName(gradeDTO.getStudentName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Student not found: " + gradeDTO.getStudentName()));

        // 🔹 Lookup Assignment by Title
        Assignment assignment = assignmentRepository.findByTitle(gradeDTO.getAssignmentTitle())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Assignment not found: " + gradeDTO.getAssignmentTitle()));

        // 🔹 Create Grade
        Grade grade = new Grade();
        grade.setStudentId(student.getId());
        grade.setAssignmentId(assignment.getId());
        grade.setCourseId(assignment.getCourseId());
        grade.setGrade(gradeDTO.getGrade());

        Grade saved = gradeRepository.save(grade);
        return mapToGradeDTO(saved);
    }

    private GradeDTO mapToGradeDTO(Grade grade) {
        GradeDTO dto = new GradeDTO();
        dto.setId(grade.getId());
        dto.setGrade(grade.getGrade());

        // 🔹 Assignment Info
        Assignment assignment = assignmentRepository.findById(grade.getAssignmentId()).orElse(null);
        dto.setAssignmentTitle(assignment != null ? assignment.getTitle() : "Unknown");

        // 🔹 Course Info
        Course course = courseRepository.findById(grade.getCourseId()).orElse(null);
        if (course != null) {
            dto.setCourseName(course.getName());
        } else {
            dto.setCourseName("Unknown");
        }

        // 🔹 Student Info
        User student = userRepository.findById(grade.getStudentId()).orElse(null);
        dto.setStudentName(student != null ? student.getName() : "Unknown");

        return dto;
    }

}
