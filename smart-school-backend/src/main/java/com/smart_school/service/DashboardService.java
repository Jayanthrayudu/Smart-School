package com.smart_school.service;

import com.smart_school.model.Grade;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.GradeRepository;
import com.smart_school.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceService attendanceService;

    @Autowired
    public DashboardService(UserRepository userRepository,
                            CourseRepository courseRepository,
                            GradeRepository gradeRepository,
                            AttendanceService attendanceService) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.gradeRepository = gradeRepository;
        this.attendanceService = attendanceService;
    }
    
    public Map<String, Object> getAdminStats() {
        Map<String, Object> data = new HashMap<>();

        long studentsCount = userRepository.findByRole("STUDENT").size();
        long teachersCount = userRepository.findByRole("TEACHER").size();
        long coursesCount = courseRepository.count();
        long attendanceIssues = attendanceService.countPendingReports();

        data.put("students", studentsCount);
        data.put("teachers", teachersCount);
        data.put("courses", coursesCount);
        data.put("attendanceIssues", attendanceIssues);

        return data;
    }
    
    public Map<String, Object> getStudentGradesSummary(String studentId) {
        Map<String, Object> gradesData = new HashMap<>();

        // 🧩 Fetch all grades for this student
        List<Grade> grades = gradeRepository.findByStudentId(studentId);

        // 🧮 Convert letter grades to numeric
        List<Double> numericGrades = grades.stream()
                .map(g -> {
                    String grade = g.getGrade() != null ? g.getGrade().toUpperCase() : "F";
                    return switch (grade) {
                        case "A+" -> 95.0;
                        case "A"  -> 90.0;
                        case "B+" -> 85.0;
                        case "B"  -> 80.0;
                        case "C"  -> 70.0;
                        case "D"  -> 60.0;
                        case "E"  -> 50.0;
                        case "F"  -> 0.0;
                        default   -> 0.0;
                    };
                })
                .toList();

        // ✅ Average grade
        double averageGrade = numericGrades.isEmpty() ? 0.0 :
                numericGrades.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

        // 🔹 Round to 1 decimal place
        averageGrade = Math.round(averageGrade * 10.0) / 10.0;

        // 📚 Total subjects enrolled
        long totalSubjects = courseRepository.countByStudentIdsContaining(studentId);

        // 🎯 Completed courses (grade >= 40)
        long completedCourses = numericGrades.stream()
                .filter(score -> score >= 40)
                .count();

        // 🗂️ Put results in map
        gradesData.put("averageGrade", averageGrade);
        gradesData.put("completedCourses", completedCourses);
        gradesData.put("totalSubjects", totalSubjects);

        return gradesData;
    }

}
