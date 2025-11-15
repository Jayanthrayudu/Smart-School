package com.smart_school.DTO;


public class ClassDTO {
    private String id;
    private String className;

    public ClassDTO() {}

    public ClassDTO(String id, String className) {
        this.id = id;
        this.className = className;
    }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

    
}