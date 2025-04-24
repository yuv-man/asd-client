import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { AuthOptions, Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    }
    accessToken?: string;
  }
}

// Define API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api` 
  : 'http://localhost:5000/api';

console.log('Auth Config - API_BASE:', API_BASE);

// Configure axios defaults
axios.defaults.timeout = 15000; // 15 second timeout

// Enhanced API with better error handling
const userAPI = {
  syncOAuth: async (user: any) => {
    console.log(`Attempting to sync OAuth user to ${API_BASE}/auth/sync`, { user });
    try {
      const response = await axios.post(`${API_BASE}/auth/sync`, user);
      console.log('OAuth sync response:', response.data);
      return response;
    } catch (error: any) {
      console.error('API Error in syncOAuth:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        request: !!error.request,
        url: `${API_BASE}/auth/sync`
      });
      
      // If there's a network error, return a structured response
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || !error.response) {
        return {
          data: { 
            error: error.message, 
            isNetworkError: true,
            code: error.code,
            // Add flag to indicate registration is needed if we can't connect
            needsRegistration: true
          },
          status: 500
        };
      }
      
      // For other errors, rethrow to be handled by the caller
      throw error;
    }
  },
  login: async (user: any) => {
    console.log(`Attempting to login user to ${API_BASE}/auth/login`, { email: user.email });
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, user);
      console.log('Login response status:', response.status);
      return response;
    } catch (error: any) {
      console.error('API Error in login:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  checkUserExists: async (email: string) => {
    console.log(`Checking if user exists: ${email}`);
    try {
      const response = await axios.get(`${API_BASE}/users/check?email=${encodeURIComponent(email)}`);
      return response.data.exists;
    } catch (error: any) {
      console.error('API Error in checkUserExists:', {
        message: error.message,
        code: error.code,
        status: error.response?.status
      });
      // Default to false if there's an error
      return false;
    }
  }
};

export { userAPI };