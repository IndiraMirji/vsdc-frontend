import axios from 'axios';

// This line checks if the Vercel variable exists; otherwise, it uses localhost for your testing
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_URL
});

export default api;