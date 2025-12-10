// src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // Tempo limite de 5 segundos para a requisição
  headers: {
    'Content-Type': 'application/json',
  },
});

// Você pode adicionar interceptors aqui (para tokens de autenticação, etc.)
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

export default api;