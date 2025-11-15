package com.smart_school.DTO;

import java.util.List;
import lombok.Data;

@Data
public class CourseDTO {
    private String id;
    private String name;
    private String instructor;
    private String schedule;
    private int studentCount;
    private boolean enrolled;
    private List<UserDTO> students; // ✅ Added properly

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getInstructor() {
        return instructor;
    }
    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }
    public String getSchedule() {
        return schedule;
    }
    public void setSchedule(String schedule) {
        this.schedule = schedule;
    }
    public int getStudentCount() {
        return studentCount;
    }
    public void setStudentCount(int studentCount) {
        this.studentCount = studentCount;
    }

    // ✅ Add real students list with getter/setter
    public List<UserDTO> getStudents() {
        return students;
    }
    public void setStudents(List<UserDTO> students) {
        this.students = students;
    }

    public boolean isEnrolled() {
        return enrolled;
    }
    public void setEnrolled(boolean enrolled) {
        this.enrolled = enrolled;
    }
}
