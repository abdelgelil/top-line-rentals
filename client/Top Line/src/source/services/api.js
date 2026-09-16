import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to inject Clerk Session JWT into API requests
export const setupAxiosInterceptors = (getToken) => {
  API.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
};

// --- Apartment API Calls ---

export const fetchApartments = async (towerFilter = '') => {
  const query = towerFilter && towerFilter !== 'All' ? `?tower=${towerFilter}` : '';
  const response = await API.get(`/apartments${query}`);
  return response.data;
};

export const fetchApartmentById = async (id) => {
  const response = await API.get(`/apartments/${id}`);
  return response.data;
};

// --- Booking API Calls ---

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  return response.data;
};

export const fetchMyBookings = async () => {
  const response = await API.get('/bookings/my-bookings');
  return response.data;
};

// --- User Profile API Calls ---

export const fetchUserProfile = async () => {
  const response = await API.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await API.put('/users/profile', userData);
  return response.data;
};

export default API;