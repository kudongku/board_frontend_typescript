import instance from '@/utils/axios';
import {
  SignUpRequest,
  LoginRequest,
  RefreshRequest,
  LoginResponse,
} from './types';

export const signup = async (signUpRequest: SignUpRequest) => {
  const response = await instance.post('/users', signUpRequest);
  return response.data;
};

export const login = async (
  loginRequest: LoginRequest,
): Promise<LoginResponse> => {
  const response = await instance.post('/users/login', loginRequest);
  return response.data;
};

export const refresh = async (refreshRequest: RefreshRequest) => {
  const response = await instance.post('users/refresh', refreshRequest);
  const refreshResponse: LoginResponse = response.data;
  localStorage.setItem('accessToken', refreshResponse.accessToken);
  return refreshResponse.accessToken;
};
