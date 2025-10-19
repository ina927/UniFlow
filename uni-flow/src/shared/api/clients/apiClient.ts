import axios from "axios";

// Create axios instance with base URL and default headers
export const apiClient = axios.create({
  baseURL : '/api',
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
      apiClient.interceptors.response.use(
        res => res,
        err => {
          if (err.response) {
            console.error("API Response ERROR:", {
              status: err.response.status,
              data: err.response.data,
              headers: err.response.headers,
            });
          } else if (err.request) {
            console.error("No response received:", err.request);
          } else {
            console.error("Axios error:", err.message);
          }
          return Promise.reject(err);
        }
      );
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
