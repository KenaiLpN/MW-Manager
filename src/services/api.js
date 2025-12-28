// src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;