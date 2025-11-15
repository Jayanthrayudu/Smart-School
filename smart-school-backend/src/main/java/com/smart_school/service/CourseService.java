package com.smart_school.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.smart_school.DTO.CourseDTO;
import com.smart_school.model.Course;
import com.smart_school.model.User;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.UserRepository;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public CourseService(CourseRepository courseRepository, UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // ✅ Get student courses (default + enrolled)
    public List<CourseDTO> getStudentCourses(String studentId) {
        List<Course> defaultCourses = courseRepository.findByIsDefaultTrue();
        List<Course> enrolledCourses = courseRepository.findByStudentIdsContaining(studentId);

        Map<String, Course> uniqueCoursesMap = new LinkedHashMap<>();
        for (Course c : defaultCourses) uniqueCoursesMap.put(c.getId(), c);
        for (Course c : enrolledCourses) uniqueCoursesMap.put(c.getId(), c);

        return uniqueCoursesMap.values().stream()
                .map(course -> mapToCourseDTO(course, studentId))
                .collect(Collectors.toList());
    }

    // ✅ Map Course to DTO
    private CourseDTO mapToCourseDTO(Course course, String studentId) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setName(course.getName());
        dto.setSchedule(course.getSchedule());
        dto.setStudentCount(course.getStudentIds() != null ? course.getStudentIds().size() : 0);

        String teacherId = course.getTeacherId();
        if (teacherId != null) {
            User teacher = userRepository.findById(teacherId).orElse(null);
            dto.setInstructor(teacher != null ? teacher.getName() : "Unknown");
        } else {
            dto.setInstructor("Unassigned");
        }

        dto.setEnrolled(course.getStudentIds() != null && course.getStudentIds().contains(studentId));
        return dto;
    }

    public boolean enrollStudentByName(String courseName, String studentId) {
        String trimmedName = courseName.trim();

        Optional<Course> courseOpt = courseRepository.findByNameIgnoreCase(trimmedName);
        if (courseOpt.isEmpty()) {
            throw new RuntimeException("Course not found: " + trimmedName);
        }

        Course course = courseOpt.get();

        if (course.getStudentIds().contains(studentId)) {
            return false; // Already enrolled
        }

        course.getStudentIds().add(studentId);
        courseRepository.save(course);
        return true;
    }
    // ✅ Get teacher’s courses
    public List<CourseDTO> getTeacherCourses(String teacherId) {
        List<Course> courses = courseRepository.findByTeacherId(teacherId);
        
        // REMOVE DUPLICATES BY ID
        Map<String, Course> uniqueMap = new LinkedHashMap<>();
        for (Course c : courses) {
            uniqueMap.put(c.getId(), c);
        }

        return uniqueMap.values().stream()
            .map(c -> mapToCourseDTO(c, null))
            .collect(Collectors.toList());
    }

    // ✅ Get all courses
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(course -> {
                    CourseDTO dto = new CourseDTO();
                    dto.setId(course.getId());
                    dto.setName(course.getName());
                    dto.setSchedule(course.getSchedule());
                    dto.setStudentCount(course.getStudentIds() != null ? course.getStudentIds().size() : 0);

                    String teacherId = course.getTeacherId();
                    if (teacherId != null) {
                        User teacher = userRepository.findById(teacherId).orElse(null);
                        dto.setInstructor(teacher != null ? teacher.getName() : "Unknown");
                    } else {
                        dto.setInstructor("Unassigned");
                    }

                    dto.setEnrolled(false);
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
