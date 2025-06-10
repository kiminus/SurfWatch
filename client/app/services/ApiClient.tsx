import axios, { AxiosError } from 'axios';

const ApiClient = axios.create({
  baseURL: 'http://localhost:8001',
  withCredentials: true, // essential for sending session cookies
  timeout: 10000,
});

ApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log the error with contextual information
    if (error.response) {
      // The server responded with a status code outside of 2xx
      console.error('API Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response Error:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('API Request Setup Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default ApiClient;
