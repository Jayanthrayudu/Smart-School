package com.smart_school.service;

import com.smart_school.DTO.AttendanceDTO;
import com.smart_school.DTO.CourseDTO;
import com.smart_school.DTO.UserDTO;
import com.smart_school.model.Attendance;
import com.smart_school.model.Course;
import com.smart_school.model.User;
import com.smart_school.repository.AttendanceRepository;
import com.smart_school.repository.CourseRepository;
import com.smart_school.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.types.ObjectId;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, CourseRepository courseRepository,
                             UserRepository userRepository) {
        this.attendanceRepository = attendanceRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
    }

    // 🧑‍🎓 Get attendance of logged-in student
    public List<AttendanceDTO> getStudentAttendance(String studentId) {
        return attendanceRepository.findByStudentId(studentId).stream()
                .map(this::mapToAttendanceDTO)
                .collect(Collectors.toList());
    }

    // 🧑‍🏫 Get students enrolled in a course (by course name)
    public CourseDTO getCourseStudents(String courseName) {
        Course course = courseRepository.findByNameIgnoreCase(courseName)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(course.getId());
        courseDTO.setName(course.getName());

        List<UserDTO> students = course.getStudentIds().stream()
                .map(id -> userRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    return dto;
                })
                .collect(Collectors.toList());

        courseDTO.setStudents(students);
        courseDTO.setStudentCount(students.size());
        return courseDTO;
    }

    // 🧑‍🏫 Mark attendance for a course using course name + student names
    public void markAttendance(String courseName, Map<String, String> attendance) {
        Course course = courseRepository.findByNameIgnoreCase(courseName)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseName));

        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        attendance.forEach((studentName, status) -> {
            User student = userRepository.findByName(studentName)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentName));

            Attendance record = new Attendance();
            record.setCourseId(course.getId());      // ✅ FIXED: store courseId, not name
            record.setCourseName(course.getName());  // Optional: for display
            record.setStudentId(student.getId());
            record.setDate(today);
            record.setStatus(status);

            attendanceRepository.save(record);
        });
    }

    // 🧑‍💼 Get all attendance records (for admin)
    public List<AttendanceDTO> getAllAttendance() {
        return attendanceRepository.findAll().stream()
                .map(this::mapToAttendanceDTO)
                .collect(Collectors.toList());
    }

    private AttendanceDTO mapToAttendanceDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus());

        // JUST USE THE STORED NAME
        dto.setCourseName(attendance.getCourseName() != null ? 
                           attendance.getCourseName() : "Unknown Course");

        // Student
        String studentName = "Unknown Student";
        String studentId = attendance.getStudentId();
        if (studentId != null && !studentId.isBlank()) {
            Optional<User> opt = userRepository.findById(studentId);
            studentName = opt.map(User::getName).orElse("Unknown Student");
        }
        dto.setStudentName(studentName);

        return dto;
    }


    // 📊 Count how many courses have pending attendance for today
    public long countPendingReports() {
        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        List<Course> allCourses = courseRepository.findAll();
        long pendingCount = 0;

        for (Course course : allCourses) {
            List<String> studentIds = course.getStudentIds();
            long markedCount = attendanceRepository.countByCourseIdAndDate(course.getId(), today);
            if (markedCount < studentIds.size()) {
                pendingCount++;
            }
        }
        return pendingCount;
    }

    // 📈 Calculate student's attendance percentage
    public double getAttendancePercentage(String studentId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId);
        if (records.isEmpty()) return 0.0;

        long presentCount = records.stream()
                .filter(r -> r.getStatus().equalsIgnoreCase("present"))
                .count();

        return (presentCount * 100.0) / records.size();
    }

    // 🧑‍🎓 Get all students for attendance marking
    public List<Map<String, String>> getAllStudents() {
        List<User> students = userRepository.findByRole("STUDENT");
        return students.stream().map(student -> Map.of(
                "studentName", student.getName() // ✅ name only, not id
        )).collect(Collectors.toList());
    }

    // 👩‍🏫 Teacher marks attendance using student names
    public void markAttendanceForTeacher(String teacherEmail, Map<String, String> attendance) {
        // Find teacher by email
        User teacher = userRepository.findByEmail(teacherEmail)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Find all courses assigned to this teacher
        List<Course> assignedCourses = courseRepository.findByTeacherId(teacher.getId());
        if (assignedCourses.isEmpty()) {
            throw new RuntimeException("No course assigned to this teacher");
        }

        // Choose the first course (extend later if you want selection)
        Course course = assignedCourses.get(0);

        String today = new SimpleDateFormat("yyyy-MM-dd").format(new Date());

        // Save attendance using student names
        attendance.forEach((studentName, status) -> {
            User student = userRepository.findByName(studentName)
                    .orElseThrow(() -> new RuntimeException("Student not found: " + studentName));

            Attendance record = new Attendance();
            record.setCourseId(course.getId());
            record.setStudentId(student.getId());
            record.setDate(today);
            record.setStatus(status);
            attendanceRepository.save(record);
        });
    }
}
