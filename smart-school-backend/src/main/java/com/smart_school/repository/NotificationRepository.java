package com.smart_school.repository;


import org.springframework.data.mongodb.repository.MongoRepository;
import com.smart_school.model.Notification;
import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByRecipientId(String recipientId);
}