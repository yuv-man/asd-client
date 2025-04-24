import axios from 'axios';
import { User } from '@/types/types';

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// Add an axios interceptor to include the user token and userId in requests
axios.interceptors.request.use((config) => {
  // Only try to get user data from localStorage in browser environment
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('wonderkid-user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    if (user._id) {
      config.headers['X-User-Id'] = user._id;
    }
  }
  return config;
});

export const userAPI = {
  create: (user) => axios.post(`${API_BASE}/profile`, user),
  getById: (id) => axios.get(`${API_BASE}/profile/${id}`),
  getByEmail: (email) => axios.get(`${API_BASE}/profile/email/${email}`),
  update: (user) => axios.put(`${API_BASE}/profile/${user._id}`, user),
  delete: (id) => axios.delete(`${API_BASE}/profile/${id}`),
  login: (user) => axios.post(`${API_BASE}/auth/login`, user),
  syncOAuth: async (user) => {
    console.log(`Attempting to sync OAuth user to ${API_BASE}/auth/sync`, { user });
    try {
      const response = await axios.post(`${API_BASE}/auth/sync`, user);
      console.log('OAuth sync response:', response.data);
      return response;
    } catch (error) {
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
  checkUserExists: async (email) => {
    console.log(`Checking if user exists: ${email}`);
    try {
      const response = await axios.get(`${API_BASE}/profile/email/${email}`);
      return response.data.exists;
    } catch (error) {
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

export const dailySummariesAPI = {
  getAllByUser: (userId) => axios.get(`${API_BASE}/dailySummaries/user/${userId}`),
  getRecentByUser: (userId) => axios.get(`${API_BASE}/dailySummaries/user/recent/${userId}`),
  getById: (id) => axios.get(`${API_BASE}/dailySummaries/${id}`),
  create: (dailySummary) => axios.post(`${API_BASE}/dailySummaries`, dailySummary),
  update: (dailySummary) => axios.put(`${API_BASE}/dailySummaries/${dailySummary._id}`, dailySummary),
  delete: (id) => axios.delete(`${API_BASE}/dailySummaries/${id}`)
}; 

export const weeklySummariesAPI = {
  getAllByUser: (userId) => axios.get(`${API_BASE}/weeklySummaries/user/${userId}`),
  getRecentByUser: (userId) => axios.get(`${API_BASE}/weeklySummaries/user/recent/${userId}`),
  getById: (id) => axios.get(`${API_BASE}/weeklySummaries/${id}`),
  create: (weeklySummary) => axios.post(`${API_BASE}/weeklySummaries`, weeklySummary),
  update: (weeklySummary) => axios.put(`${API_BASE}/weeklySummaries/${weeklySummary._id}`, weeklySummary),
};

export const exercisesAPI = {
  getAll: () => axios.get(`${API_BASE}/exercises`),
  getById: (id) => axios.get(`${API_BASE}/exercises/${id}`),
  getByArea: (area) => axios.post(`${API_BASE}/exercises/search`, { area }),
  getSession: (areas) => axios.get(`${API_BASE}/exercises/areas?areas=${areas}`),
  create: (exercise) => axios.post(`${API_BASE}/exercises`, exercise),
  update: (exercise) => axios.put(`${API_BASE}/exercises/${exercise._id}`, exercise),
  delete: (id) => axios.delete(`${API_BASE}/exercises/${id}`),
  createExerciseAttempt: (exerciseAttempt) => axios.post(`${API_BASE}/exercises/attempt`, exerciseAttempt),
}; 

export const dashboardAPI = {
  getDailySummaries: (days) => 
    axios.get(`${API_BASE}/dashboard/daily-summaries/${days ? `?days=${days}` : ''}`),
  
  getAreaProgress: () => 
    axios.get(`${API_BASE}/dashboard/area-progress`),
  
  getImprovement: (area, days) => 
    axios.get(`${API_BASE}/dashboard/improvement/${area}${days ? `?days=${days}` : ''}`),
  
  getRecentActivity: () => 
    axios.get(`${API_BASE}/dashboard/recent-activity`),
};
