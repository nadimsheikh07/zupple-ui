import axios from "axios";

// Axios instance
const authAxiosInstance = axios.create({
  baseURL: process.env.NEXT_AUTH_URL,
  // Axios configuration options here
});

// Interceptor to handle 301 redirects
authAxiosInstance.interceptors.response.use(
  response => {
    // If the response is successful, just return the response
    return response;
  },
  error => {
    const { response } = error;
    if (response && response.status === 403) {
    }
    return Promise.reject(error);
  }
);

export default authAxiosInstance;