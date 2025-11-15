// com.smart_school.controller.SchoolClassController.java

package com.smart_school.controller;

import com.smart_school.model.SchoolClass;
import com.smart_school.service.SchoolClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
public class SchoolClassController {

    @Autowired
    private SchoolClassService classService;
    
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    public List<SchoolClass> getAllClasses() {
        return classService.getAllClasses();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    public ResponseEntity<SchoolClass> createClass(@RequestBody SchoolClass classObj) {
        return ResponseEntity.ok(
            classService.createClass(
                classObj.getName(),
                classObj.getSection(),
                classObj.getCapacity()
            )
        );
    }
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable String id) {
        classService.deleteClassById(id);
        return ResponseEntity.ok("Class deleted successfully");
    }

}