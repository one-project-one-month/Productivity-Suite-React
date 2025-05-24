import { COOKIE_CONSTANTS } from '@/app/constant';
import Cookies from 'js-cookie';

export const assignLoginToken = (accessToken: string, refreshToken: string) => {
  Cookies.set(COOKIE_CONSTANTS.ACCESS_TOKEN, accessToken);
  Cookies.set(COOKIE_CONSTANTS.REFRESH_TOKEN, refreshToken);
};

export const removeToken = () => {
  Cookies.remove(COOKIE_CONSTANTS.ACCESS_TOKEN);
  Cookies.remove(COOKIE_CONSTANTS.REFRESH_TOKEN);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('auth-storage');
};
