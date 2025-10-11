import axios from "axios";
import { getSession } from "next-auth/react";

// Axios instance
const authAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  // Axios configuration options here
});

// Request interceptor
authAxiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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