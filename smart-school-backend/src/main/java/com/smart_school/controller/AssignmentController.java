package com.smart_school.controller;

import com.smart_school.DTO.AssignmentDTO;
import com.smart_school.model.Course;
import com.smart_school.repository.CourseRepository;
import com.smart_school.service.AssignmentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final CourseRepository courseRepository;

    public AssignmentController(AssignmentService assignmentService, CourseRepository courseRepository) {
        this.assignmentService = assignmentService;
        this.courseRepository = courseRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<?> createAssignment(@RequestBody AssignmentDTO assignmentDTO) {
        try {
            if (assignmentDTO.getCourseName() != null && 
                (assignmentDTO.getCourseId() == null || assignmentDTO.getCourseId().isEmpty())) {

                Course course = courseRepository.findByNameIgnoreCase(assignmentDTO.getCourseName())
                        .orElseThrow(() -> new IllegalArgumentException("Course not found: " + assignmentDTO.getCourseName()));

                assignmentDTO.setCourseId(course.getId()); // ✅ MongoDB _id
            }
            return ResponseEntity.ok(assignmentService.createAssignment(assignmentDTO));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal Server Error: " + e.getMessage());
        }
    }


    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/student")
    public ResponseEntity<List<AssignmentDTO>> getStudentAssignments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(assignmentService.getStudentAssignments(email));
    }

    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/teacher")
    public ResponseEntity<List<AssignmentDTO>> getTeacherAssignments() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(assignmentService.getTeacherAssignments(email));
    }
    @PutMapping("/{assignmentId}/complete")
    public ResponseEntity<?> markAsCompleted(@PathVariable String assignmentId) {
        boolean updated = assignmentService.markAssignmentCompleted(assignmentId);
        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Assignment not found");
        }
        return ResponseEntity.ok("Assignment marked as completed");
    }
}