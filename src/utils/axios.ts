import { LoginResponse } from '@/api/auth/types';
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const newConfig = { ...config };
    const token = localStorage.getItem('accessToken');

    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] REQUEST ${newConfig.method} ${newConfig.url}`);
    }

    return newConfig;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[API] RESPONSE ${response.config.method} ${response.config.url} | ${response.status}`,
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const newError = { ...error };
    const method = error.config?.method || '';
    const url = error.config?.url || '';
    const data = error.response?.data || '';
    const status = error.response?.status || '';

    console.error(`Response Error: ${method} ${url} ${data} ${status}`);

    if (newError.response && newError.response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await instance.post('users/refresh', {
            refreshToken,
          });
          const refreshResponse: LoginResponse = response.data;
          localStorage.setItem('accessToken', refreshResponse.accessToken);

          if (newError.config) {
            newError.config.headers.Authorization = `Bearer ${refreshResponse.accessToken}`;
            return await instance(newError.config);
          }
        } catch (refreshError) {
          console.error('Refresh token request failed:', refreshError);
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(newError);
  },
);

export default instance;
