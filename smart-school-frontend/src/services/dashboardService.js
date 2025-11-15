import api from './api';

export const fetchAdminDashboardData = async () => {
  return await api.get('/dashboard/dashboard-data');
};

export const fetchTeacherDashboardData = async () => {
  return await api.get('/dashboard/teacher-dashboard');
};

export const fetchStudentDashboardData = async () => {
  return await api.get('/dashboard/student-dashboard'); 
};

