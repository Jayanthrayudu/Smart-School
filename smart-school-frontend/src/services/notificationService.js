import api from './api';

export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const sendNotification = async (data) => {
  const response = await api.post('/notifications', data);
  return response.data;
};