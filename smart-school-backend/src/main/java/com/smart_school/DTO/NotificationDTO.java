package com.smart_school.DTO;

import lombok.Data;

@Data
public class NotificationDTO {
    private String id;
    private String message;
    private String date;
    
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getRecipientId() {
		// TODO Auto-generated method stub
		return null;
	}
}