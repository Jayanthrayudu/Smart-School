import api from './api';

export const getStudentAssignments = async () => {
  const response = await api.get('/assignments/student');
  return response.data;
};

export const getTeacherAssignments = async () => {
  const response = await api.get('/assignments/teacher');
  return response.data;
};

export const createAssignment = async (data) => {
  const response = await api.post('/assignments', data);
  return response.data;
};

export const markAssignmentCompleted = async (assignmentId) => {
  const response = await api.put(`/assignments/${assignmentId}/complete`);
  return response.data;
};