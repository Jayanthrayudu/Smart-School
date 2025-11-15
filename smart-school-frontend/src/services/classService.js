// src/services/classService.js
import api from './api';

export const fetchAllClasses = () => api.get('/classes');

export const createClass = (name, section, capacity) =>
  api.post('/classes', { name, section, capacity });
export const deleteClass = (id) => api.delete(`/classes/${id}`);

