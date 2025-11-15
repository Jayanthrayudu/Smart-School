import api from './api';

export const getStudentGrades = async () => {
  const response = await api.get('/grades/student');
  return response.data;
};

export const getTeacherGrades = async () => {
  const response = await api.get('/grades/teacher');
  return response.data;
};

export const submitGrade = async (data) => {
  const response = await api.post('/grades', data);
  return response.data;
};