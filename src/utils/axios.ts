import { refresh } from '@/api/auth';
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] REQUEST ${config.method} ${config.url}`);
    }

    return config;
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
    const method = error.config?.method || '';
    const url = error.config?.url || '';
    const data = error.response?.data || '';
    const status = error.response?.status || '';

    console.error(`Response Error: ${method} ${url} ${data} ${status}`);

    if (error.response && error.response.status === 403) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const newAccessToken = await refresh({ refreshToken });

          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return await instance(error.config);
          }
        } catch (refreshError) {
          console.error('Refresh token request failed:', refreshError);
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
