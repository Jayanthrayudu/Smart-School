import api from './api';

// Student
export const getStudentCourses = async () => {
  const response = await api.get('/courses/student'); // ID from token
  return response.data;
};

// Teacher
export const getTeacherCourses = async () => {
  const response = await api.get('/courses/teacher'); // ID from token
  return response.data;
};

// Admin
export const getAllCourses = async () => {
  const response = await api.get('/courses/all');
  return response.data;
};

// Admin assigns teacher to course (by name)
export const assignCourseToTeacher = (courseName, teacherName) => {
  return api.put(`/courses/by-name/${courseName}/assign-teacher/${teacherName}`);
};

// ✅ Student enrolls in course by name
export const enrollCourse = (courseName) => {
  return api.post(`/courses/enroll/${courseName}`);
};