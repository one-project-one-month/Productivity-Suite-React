import routes from './route';
import api, { authApi } from '@/api';
import type { SignInType } from '@/app/SignIn';
import type { SignUpType } from '@/app/Signup';

export const signIn = async (payload: SignInType) =>
  authApi.post(routes.signIn, payload);

export const signUp = async (payload: SignUpType) =>
  authApi.post(routes.signUp, payload);

export const logout = async () => await api.post(routes.logout);
