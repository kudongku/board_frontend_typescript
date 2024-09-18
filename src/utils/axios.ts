import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // 환경 변수 사용할 것.
  timeout: 10000, // 타임아웃 설정 알아보기
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('bearerToken');

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

export default instance;
