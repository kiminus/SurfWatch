// api/index.js
import axios from 'axios';

// ** IMPORTANT: Replace with your actual backend URL **
// Use http://10.0.2.2:8000 for Android Emulator accessing local backend
// Use http://localhost:8000 for iOS Simulator accessing local backend
// Use your machine's network IP for physical devices accessing local backend
const API_BASE_URL = 'http://localhost:8000'; // ADJUST THIS

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for sending session cookies
  timeout: 10000,
});

// Optional: Add basic logging or error handling interceptors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Call Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
