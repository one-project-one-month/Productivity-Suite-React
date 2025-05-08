import axios from "axios";

export const baseURL = import.meta.env.VITE_BACKEND_SERVER;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    ContentType: "application/json",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  },
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
    }
    return Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
