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
    const token = localStorage.getItem('bearerToken');

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[API] REQUEST ' + config.method + ' ' + config.url);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error.message);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[API] RESPONSE ' +
          response.config.method +
          ' ' +
          response.config.url +
          ' | ' +
          response.status
      );
    }
    return response;
  },
  (error: AxiosError) => {
    console.error(
      'Response Error:',
      error.config?.method +
        ' ' +
        error.config?.url +
        ' ' +
        error.response?.data +
        ' ' +
        error.response?.status
    );

    return Promise.reject(error);
  }
);

export default instance;
