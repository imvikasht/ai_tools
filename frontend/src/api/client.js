import axios from "axios";

const isProd = import.meta.env.PROD;
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isProd ? "/api" : "http://localhost:5000/api")
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ai-multi-tool-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
