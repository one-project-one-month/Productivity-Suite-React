import { COOKIE_CONSTANTS } from '@/app/constant';
import axios from 'axios';
import Cookies from 'js-cookie';

export const baseURL = import.meta.env.VITE_BACKEND_SERVER + '/api';


const api = axios.create({
  baseURL: baseURL,
  headers: {
    ContentType: 'application/json',
    'Cache-Control': 'no-cache',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (request) => {
    // Get access token and add to Authorization header
    const accessToken = Cookies.get(COOKIE_CONSTANTS.ACCESS_TOKEN);

    if (accessToken) {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    request.headers['X-Request-Start-Time'] = Math.floor(Date.now() / 1000);

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
  baseURL: import.meta.env.VITE_BACKEND_SERVER + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default api;
