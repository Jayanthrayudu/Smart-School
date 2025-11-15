import api from './api';

// =================== STUDENT ===================

// Get logged-in student's attendance
export const getStudentAttendance = async () => {
  const response = await api.get('/attendance/student');
  return response.data;
};

// =================== TEACHER ===================

// Get all students in a specific course (teacher or admin)
// → Now uses course NAME (e.g., "Telugu"), not ID
export const getCourseStudents = async (courseName) => {
  const response = await api.get(`/attendance/course/${encodeURIComponent(courseName)}/students`);
  return response.data;
};

// Mark attendance for a specific course (teacher or admin)
// → Now uses course NAME (e.g., "Telugu"), not ID
export const markAttendance = async (courseName, attendance) => {
  const response = await api.post(`/attendance/course/${encodeURIComponent(courseName)}`, attendance);
  return response.data;
};

// Mark teacher's own attendance
export const markTeacherAttendance = async (attendance) => {
  const response = await api.post('/attendance/teacher', attendance);
  return response.data;
};

// =================== ADMIN / TEACHER ===================

// Get all attendance records (admin or teacher)
export const getAllAttendance = async () => {
  const response = await api.get('/attendance/all');
  return response.data;
};

// Get all students (admin or teacher)
export const getAllStudents = async () => {
  const response = await api.get('/attendance/students');
  return response.data;
};