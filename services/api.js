import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Add an axios interceptor to include the user token and userId in requests
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('wonderkid-user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  if (user._id) {
    config.headers['X-User-Id'] = user._id;
  }
  return config;
});

export const userAPI = {
  create: (user) => axios.post(`${API_BASE}/profile`, user),
  getById: (id) => axios.get(`${API_BASE}/profile/${id}`),
  update: (user) => axios.put(`${API_BASE}/profile/${user._id}`, user),
  delete: (id) => axios.delete(`${API_BASE}/profile/${id}`),
};

export const dailySummariesAPI = {
  getAllByUser: (userId) => axios.get(`${API_BASE}/dailySummaries/user/${userId}`),
  getRecentByUser: (userId) => axios.get(`${API_BASE}/dailySummaries/user/${userId}/recent`),
  getById: (id) => axios.get(`${API_BASE}/dailySummaries/${id}`),
  create: (dailySummary) => axios.post(`${API_BASE}/dailySummaries`, dailySummary),
  update: (dailySummary) => axios.put(`${API_BASE}/dailySummaries/${dailySummary._id}`, dailySummary),
  delete: (id) => axios.delete(`${API_BASE}/tasks/${id}`)
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
