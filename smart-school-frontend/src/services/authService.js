import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getUsers = async () => {
  const response = await api.get('/auth/users');
  return response.data;
};

export const deleteUser = async (userId) => {
  const res = await axios.delete(`/api/users/${userId}`);
  return res.data;
};
