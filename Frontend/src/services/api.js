import axios from "axios";
import { data } from "react-router-dom";
import { getMyBookings } from "../../../Backend/controllers/bookingController";
import { deleteUser, getDashboardStats, updateUserRole } from "../../../Backend/controllers/adminController";

//API Configration

const API_URl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

//Create axios instance with default config

const api = axios.create({
  baseURL: API_URl,
  headers: {
    'Content-Type' : 'application/json',
  },
  timeout: 10000,
})

//Ads token to headers
api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//handles errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if(error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login'
    }
    if(error.response?.status === 403) {
    console.error('Access denied:', error.response.data.messsage)
  }
  return Promise.reject(error);
  }
);

//API functions

//Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

//Vehicle APIs
export const vehicleAPI = {
  getAll: (params) => api.get('/vehicles', {params}),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
  getStats: () => api.get('/vehicles/stats/overiew'),
};

//Booking APIs
export const bookingsApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.put(`/bookings/${id}/cancel`),
  uploadScreenshot: (id, FormData ) => api.post(`/bookings/${id}/screenshot`, FormData, {
    headers: {'Content-Type': 'multipart/form-data'}
  }),
};

//Admin APIs
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getUser: (params) => api.get('/admin/users', {params}),
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id, data) => api.put(`/admin/bookings/${id}/status`, data),
  getPayments: (params) => api.get('/admin/payments', { params }),
  verifyPayment: (id, data) => api.put(`/admin/payments/${id}/verify`, data),
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),
};

export default api;
