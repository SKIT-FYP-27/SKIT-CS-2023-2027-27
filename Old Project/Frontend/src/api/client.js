import axios from "axios";

// Central axios instance for once the backend is live (Harsh/Katyayini's
// APIs). Point VITE_API_BASE_URL at the real host in .env when ready —
// see useStudentProfile / useHODAnalytics for the mock-vs-live switch.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("uei_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
