package com.smart_school.service;

import com.smart_school.DTO.UserDTO;
import com.smart_school.model.*;
import com.smart_school.repository.*;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final AssignmentRepository assignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final GradeRepository gradeRepository;

    public UserService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            AssignmentRepository assignmentRepository,
            AttendanceRepository attendanceRepository,
            GradeRepository gradeRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.assignmentRepository = assignmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.gradeRepository = gradeRepository;
    }

    // ✅ 1. Return all users as DTOs (existing)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setRole(user.getRole());
            return dto;
        }).collect(Collectors.toList());
    }

    // ✅ 2. Student Dashboard
    public Map<String, Object> getStudentDashboard(String email) {
        Map<String, Object> data = new HashMap<>();
        User student = userRepository.findByEmail(email).orElseThrow();

        List<Grade> grades = gradeRepository.findByStudentId(student.getId());
        List<Attendance> attendance = attendanceRepository.findByStudentId(student.getId());
        List<Course> courses = courseRepository.findAll(); // Optional: filter enrolled only

        data.put("user", student);
        data.put("grades", grades);
        data.put("attendance", attendance);
        data.put("courses", courses);
        return data;
    }	

    // ✅ 3. Teacher Dashboard
    public Map<String, Object> getTeacherDashboard(String email) {
        Map<String, Object> data = new HashMap<>();
        User teacher = userRepository.findByEmail(email).orElseThrow();

        List<Course> teacherCourses = courseRepository.findByTeacherId(teacher.getId());
        List<Assignment> assignments = assignmentRepository.findByTeacherId(teacher.getId());

        data.put("user", teacher);
        data.put("courses", teacherCourses);
        data.put("assignments", assignments);
        return data;
    }

    // ✅ 4. Admin Dashboard
    public Map<String, Object> getAdminDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalCourses", courseRepository.count());
        data.put("totalAssignments", assignmentRepository.count());
        return data;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    public List<User> getUsersByRole(String role) {
        return userRepository.findByRoleIgnoreCase(role)
                             .stream()
                             .collect(Collectors.collectingAndThen(
                                 Collectors.toMap(User::getId, Function.identity(), (a, b) -> a),
                                 m -> new ArrayList<>(m.values())
                             ));
    }


}