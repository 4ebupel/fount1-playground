import axios from 'axios';
import { getSession, signIn } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_XANO_API_BASE_URL,
});

// Request interceptor to add the access token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the session
        const session = await getSession();

        if (session?.accessToken) {
          // Update the Authorization header with the new access token
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // Session is invalid; redirect to login
          signIn();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Refresh token failed; redirect to login
        signIn();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
