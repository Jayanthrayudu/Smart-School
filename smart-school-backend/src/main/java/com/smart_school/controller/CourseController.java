package com.smart_school.controller;

import com.smart_school.DTO.CourseDTO;
import com.smart_school.model.Course;
import com.smart_school.model.CreateCourseRequest;
import com.smart_school.model.User;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.UserRepository;
import com.smart_school.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CourseController(
            CourseService courseService,
            UserRepository userRepository,
            CourseRepository courseRepository
    ) {
        this.courseService = courseService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    // ✅ Get all student courses (default + enrolled)
    @GetMapping("/student")
    public ResponseEntity<List<CourseDTO>> getStudentCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(courseService.getStudentCourses(student.getId()));
    }

    // ✅ Get teacher courses
    @GetMapping("/teacher")
    public ResponseEntity<List<CourseDTO>> getTeacherCourses() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User teacher = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));
        return ResponseEntity.ok(courseService.getTeacherCourses(teacher.getId()));
    }

    // ✅ Get all courses (for admin)
    @GetMapping("/all")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    // ✅ Assign teacher to course by name
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/by-name/{courseName}/assign-teacher/{teacherName}")
    public ResponseEntity<?> assignTeacherToCourseByName(
            @PathVariable String courseName,
            @PathVariable String teacherName) {

        Optional<User> teacherOpt = userRepository.findByName(teacherName)
                .filter(u -> "TEACHER".equalsIgnoreCase(u.getRole()));

        if (teacherOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Teacher not found with name: " + teacherName);
        }

        Optional<Course> courseOpt = courseRepository.findByNameIgnoreCase(courseName);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Course not found with name: " + courseName);
        }

        Course course = courseOpt.get();
        course.setTeacherId(teacherOpt.get().getId());
        courseRepository.save(course);

        return ResponseEntity.ok("Teacher '" + teacherName + "' assigned successfully to course '" + courseName + "'.");
    }

    // ✅ Enroll student in a course (no duplicates)
    @PostMapping("/enroll/{courseName}")
    public ResponseEntity<?> enrollInCourse(@PathVariable String courseName) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        boolean enrolled = courseService.enrollStudentByName(courseName, student.getId());
        if (!enrolled) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already enrolled in this course.");
        }

        return ResponseEntity.ok("Enrolled successfully!");
    }
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/admin/create-default")
    public ResponseEntity<?> createDefaultCourse(@RequestBody CreateCourseRequest request) {
        String name = request.getName().trim();
        
        // CHECK DUPLICATE DEFAULT COURSE
        boolean exists = courseRepository.findByIsDefaultTrue().stream()
                .anyMatch(c -> c.getName().equalsIgnoreCase(name));
        
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Default course already exists: " + name);
        }

        Course course = new Course();
        course.setName(name);
        course.setSchedule(request.getSchedule());
        course.setTeacherId(request.getTeacherId());
        course.setTeacherEmail(request.getTeacherEmail());
        course.setDefault(true);
        course.setStudentIds(new ArrayList<>());
        course.setAssignments(new ArrayList<>());

        Course saved = courseRepository.save(course);
        
        return ResponseEntity.ok(Map.of(
            "message", "Default course created successfully",
            "courseId", saved.getId(),
            "name", saved.getName()
        ));
    }
}
