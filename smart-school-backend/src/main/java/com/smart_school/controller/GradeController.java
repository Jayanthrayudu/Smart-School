package com.smart_school.controller;


import com.smart_school.DTO.GradeDTO;
import com.smart_school.service.GradeService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    @GetMapping("/student")
    public ResponseEntity<List<GradeDTO>> getStudentGrades() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(gradeService.getStudentGrades(email));
    }

    @GetMapping("/teacher")
    public ResponseEntity<List<GradeDTO>> getTeacherGrades() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(gradeService.getTeacherGrades(email));
    }

    @PostMapping
    public ResponseEntity<GradeDTO> submitGrade(@RequestBody GradeDTO gradeDTO) {
        return ResponseEntity.ok(gradeService.submitGrade(gradeDTO));
    }
}