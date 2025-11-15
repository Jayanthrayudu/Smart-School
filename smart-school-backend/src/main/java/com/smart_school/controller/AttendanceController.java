package com.smart_school.controller;

import com.smart_school.DTO.AttendanceDTO;
import com.smart_school.DTO.CourseDTO;
import com.smart_school.model.Course;
import com.smart_school.model.User;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.UserRepository;
import com.smart_school.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public AttendanceController(AttendanceService attendanceService , UserRepository userRepository,CourseRepository courseRepository) {
        this.attendanceService = attendanceService;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    // 🧑‍🎓 Get attendance of logged-in student
    @GetMapping("/student")
    public ResponseEntity<List<AttendanceDTO>> getStudentAttendance() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return ResponseEntity.ok(attendanceService.getStudentAttendance(student.getId()));
    }

    // 🧑‍🏫 Get all students for attendance marking
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Map<String, String>>> getAllStudentsForAttendance() {
        return ResponseEntity.ok(attendanceService.getAllStudents());
    }

    // 🧑‍🏫 Get students enrolled in a specific course (by course name)
    @GetMapping("/course/{courseName}/students")
    public ResponseEntity<CourseDTO> getCourseStudents(@PathVariable String courseName) {
        return ResponseEntity.ok(attendanceService.getCourseStudents(courseName));
    }

    // 🧑‍🏫 Mark attendance by course name and student names
    @PostMapping("/course/{courseName}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<Void> markAttendance(@PathVariable String courseName, @RequestBody Map<String, String> attendance) {
        attendanceService.markAttendance(courseName, attendance);
        return ResponseEntity.ok().build();
    }

    // 🧑‍💼 Get all attendance records (for admin)
    @GetMapping("/all")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    // 👩‍🏫 Teacher marks attendance (for their own assigned course)
    @PostMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> markAttendanceForTeacher(@RequestBody Map<String, String> attendance) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        attendanceService.markAttendanceForTeacher(email, attendance);
        return ResponseEntity.ok().build();
    }
    
}
