package com.smart_school.service;


import com.smart_school.DTO.NotificationDTO;
import com.smart_school.model.Notification;
import com.smart_school.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<NotificationDTO> getNotifications(String recipientId) {
        return notificationRepository.findByRecipientId(recipientId).stream()
                .map(this::mapToNotificationDTO)
                .collect(Collectors.toList());
    }

    public NotificationDTO sendNotification(NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setMessage(notificationDTO.getMessage());
        notification.setRecipientId(notificationDTO.getRecipientId());
        notification.setDate(new java.util.Date().toString());
        Notification saved = notificationRepository.save(notification);
        return mapToNotificationDTO(saved);
    }

    private NotificationDTO mapToNotificationDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setMessage(notification.getMessage());
        dto.setDate(notification.getDate());
        return dto;
    }
}