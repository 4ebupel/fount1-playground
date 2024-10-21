import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Adjust the import path accordingly

const apiClientServer = async () => {
  const instance = axios.create({
    baseURL: process.env.XANO_API_BASE_URL,
  });

  // Request interceptor to add the access token to headers
  instance.interceptors.request.use(
    async (config) => {
      const session = await getServerSession(authOptions);

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default apiClientServer;
