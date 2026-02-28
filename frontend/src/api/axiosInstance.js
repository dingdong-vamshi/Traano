import axios from "axios";

/**
 * Axios instance configured with:
 * - Base URL from VITE_API_URL env var (falls back to /api for Vite proxy)
 * - 30s timeout for large file uploads
 * - Response error interceptor
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 60000,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    console.error("API Error:", message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
