package com.smart_school.DTO;


import lombok.Data;

@Data
public class LoginResponse {
    private UserDTO user;
    private String token;
    
    
	public UserDTO getUser() {
		return user;
	}
	public void setUser(UserDTO user) {
		this.user = user;
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
}