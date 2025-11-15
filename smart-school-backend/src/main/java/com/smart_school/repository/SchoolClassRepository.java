// com.smart_school.repository.SchoolClassRepository.java

package com.smart_school.repository;

import com.smart_school.model.SchoolClass;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SchoolClassRepository extends MongoRepository<SchoolClass, String> {
}