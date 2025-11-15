package com.smart_school.controller;

import com.smart_school.model.Course;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.UserRepository;
import com.smart_school.service.AttendanceService;
import com.smart_school.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AttendanceService attendanceService;

    // Keep admin & student logic unchanged
    @GetMapping
    public ResponseEntity<?> getDashboardData(Principal principal) {
        String email = principal.getName(); // JWT subject = email
        var userOpt = userRepository.findByEmail(email); // ✅ lookup by email instead of username

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        var user = userOpt.get();
        String role = user.getRole(); // "ADMIN", "TEACHER", "STUDENT"
        Map<String, Object> data = new HashMap<>();

        switch (role) {
            case "ADMIN":
                data = dashboardService.getAdminStats();
                break;

            case "TEACHER":
                List<Course> assignedCourses = courseRepository.findByTeacherId(user.getId());
                long pendingGrading = assignedCourses.stream()
                        .filter(course -> course.getAssignments() != null &&
                                course.getAssignments().stream().anyMatch(a -> !a.isGraded()))
                        .count();

                data.put("assignedCoursesCount", assignedCourses.size());
                data.put("pendingGrading", pendingGrading);
                data.put("assignedCourses", assignedCourses);
                break;

            case "STUDENT":
                data.put("enrolledCourses", courseRepository.countByStudentIdsContaining(user.getId()));
                data.put("attendance", attendanceService.getAttendancePercentage(user.getId()));
                break;

            default:
                return ResponseEntity.badRequest().body("Invalid role");
        }

        return ResponseEntity.ok(data);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/dashboard-data")
    public ResponseEntity<Map<String, Object>> getAdminDashboardData() {
        Map<String, Object> data = dashboardService.getAdminStats();
        return ResponseEntity.ok(data);
    }

    // ✅ TEACHER-SPECIFIC DASHBOARD ENDPOINT
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    @GetMapping("/teacher-dashboard")
    public ResponseEntity<?> getTeacherDashboardData(Principal principal) {
        String email = principal.getName(); // JWT subject = email
        var userOpt = userRepository.findByEmail(email); // ✅ changed to findByEmail()

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        var user = userOpt.get();

        // Get assigned courses from DB
        List<Course> assignedCourses = courseRepository.findByTeacherId(user.getId());

        // Calculate pending grading based on ungraded assignments
        long pendingGrading = assignedCourses.stream()
                .filter(course -> course.getAssignments() != null &&
                        course.getAssignments().stream().anyMatch(a -> !a.isGraded()))
                .count();

        Map<String, Object> data = new HashMap<>();
        data.put("assignedCoursesCount", assignedCourses.size());
        data.put("pendingGrading", pendingGrading);
        data.put("assignedCourses", assignedCourses);

        return ResponseEntity.ok(data);
    }
 // ✅ STUDENT DASHBOARD ENDPOINT (simplified)
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    @GetMapping("/student-dashboard")
    public ResponseEntity<?> getStudentDashboardData(Principal principal) {
        String email = principal.getName();
        var userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        var user = userOpt.get();
        Map<String, Object> data = new HashMap<>();

        // 🧩 Enrolled courses
        List<Course> enrolledCourses = courseRepository.findByStudentIdsContaining(user.getId());
        data.put("enrolledCoursesCount", enrolledCourses.size());
        data.put("enrolledCourses", enrolledCourses);

        // 📊 Attendance (use existing methods)
        double attendancePercentage = attendanceService.getAttendancePercentage(user.getId());
        data.put("attendancePercentage", attendancePercentage);

        // ✅ Return detailed attendance records
        var attendanceRecords = attendanceService.getStudentAttendance(user.getId());
        data.put("attendanceRecords", attendanceRecords);

        // 🧾 Recent assignments (latest 5)
        var assignments = enrolledCourses.stream()
                .filter(course -> course.getAssignments() != null)
                .flatMap(course -> course.getAssignments().stream())
                .sorted((a, b) -> b.getDueDate().compareTo(a.getDueDate()))
                .limit(5)
                .toList();
        data.put("recentAssignments", assignments);

        // 🏆 Grades overview (if available)
        var grades = dashboardService.getStudentGradesSummary(user.getId());
        data.put("grades", grades);

        return ResponseEntity.ok(data);
    }

}
