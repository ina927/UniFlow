import axios from "axios";

// Get the base URL from environment variable or default to empty string
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Create axios instance with base URL and default headers
export const apiClient = axios.create({
  baseURL,
  headers: { 
    "Content-Type": "application/json",
    "user-id": typeof window !== 'undefined' ? localStorage.getItem("user-id") || '' : ''
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Request ERROR:', error);
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data,
        headers: response.headers,
      });
    }
    return response;
  },
  (error) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Response ERROR:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }
    return Promise.reject(error);
  }
);
