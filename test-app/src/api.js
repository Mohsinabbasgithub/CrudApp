import axios from 'axios';

// With CRA proxy set to http://localhost:5000, requests to /api/*
// will be forwarded to the backend in development.
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const getItems = () => api.get('/items').then(r => r.data);
export const getItem = (id) => api.get(`/items/${id}`).then(r => r.data);
export const createItem = (payload) => api.post('/items', payload).then(r => r.data);
export const updateItem = (id, payload) => api.put(`/items/${id}`, payload).then(r => r.data);
export const deleteItem = (id) => api.delete(`/items/${id}`);

export default api;
