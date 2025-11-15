package com.smart_school.service;

import com.smart_school.DTO.AssignmentDTO;
import com.smart_school.model.Assignment;
import com.smart_school.model.Course;
import com.smart_school.repository.AssignmentRepository;
import com.smart_school.repository.CourseRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;

    public AssignmentService(
            AssignmentRepository assignmentRepository,
            CourseRepository courseRepository
    ) {
        this.assignmentRepository = assignmentRepository;
        this.courseRepository = courseRepository;
    }

    // 🔹 Return all assignments for students
    public List<AssignmentDTO> getStudentAssignments(String studentId) {
        return assignmentRepository.findAll()
                .stream()
                .map(this::mapToAssignmentDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Return assignments for courses taught by teacher
    public List<AssignmentDTO> getTeacherAssignments(String teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId); // ✅ use teacherId
        return courses.stream()
                .flatMap(course -> assignmentRepository.findByCourseId(course.getId()).stream())
                .map(this::mapToAssignmentDTO)
                .collect(Collectors.toList());
    }

    // 🔹 Create a new assignment
    public AssignmentDTO createAssignment(AssignmentDTO assignmentDTO) {
        Assignment assignment = new Assignment();
        assignment.setTitle(assignmentDTO.getTitle());
        assignment.setDueDate(assignmentDTO.getDueDate());
        assignment.setGraded(false);

        // Find course by name
        Course course = courseRepository.findByNameIgnoreCase(assignmentDTO.getCourseName())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + assignmentDTO.getCourseName()));
        assignment.setCourseId(course.getId());

        // Assign teacherId from authentication
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        assignment.setTeacherId(email);

        Assignment saved = assignmentRepository.save(assignment);
        return mapToAssignmentDTO(saved);
    }

    // 🔹 Count ungraded assignments for teacher
    public long getUngradedAssignmentCount(String teacherEmail) {
        return assignmentRepository.countByTeacherIdAndGradedFalse(teacherEmail);
    }

    // 🔹 Map assignment to DTO including courseName
    private AssignmentDTO mapToAssignmentDTO(Assignment assignment) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setCourseId(assignment.getCourseId());
        dto.setDueDate(assignment.getDueDate());

        // Fetch course name from courseId
        dto.setCourseName(courseRepository.findById(assignment.getCourseId())
                .map(Course::getName)
                .orElse("Unknown"));

        dto.setStatus(assignment.isGraded() ? "Graded" : "Pending");
        return dto;
    }
    public boolean markAssignmentCompleted(String assignmentId) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(assignmentId);
        if (assignmentOpt.isEmpty()) return false;

        Assignment assignment = assignmentOpt.get();
        assignment.setStatus("Completed"); // assuming your Assignment model has a status field
        assignmentRepository.save(assignment); // updates existing document
        return true;
    }
}
