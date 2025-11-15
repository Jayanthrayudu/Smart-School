package com.smart_school.controller;


import com.smart_school.DTO.UserDTO;
import com.smart_school.model.User;
import com.smart_school.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;


@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.getUserByEmail(email);

        switch (user.getRole().toUpperCase()) {
            case "STUDENT":
                return ResponseEntity.ok(userService.getStudentDashboard(email));
            case "TEACHER":
                return ResponseEntity.ok(userService.getTeacherDashboard(email));
            case "ADMIN":
                return ResponseEntity.ok(userService.getAdminDashboard());
            default:
                return ResponseEntity.badRequest().body("Unknown role");
        }
    }
    @GetMapping("/students")
    public ResponseEntity<List<UserDTO>> getAllStudents() {
        List<User> students = userService.getUsersByRole("STUDENT");
        List<UserDTO> studentDTOs = students.stream()
            .map(u -> new UserDTO(u.getId(), u.getName(), u.getRole()))
            .toList();
        return ResponseEntity.ok(studentDTOs);
    }


}