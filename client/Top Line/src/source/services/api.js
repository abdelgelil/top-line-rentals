import axios from 'axios';

const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const cleanBase = rawBase.replace(/\/$/, '');

const API = axios.create({
  baseURL: cleanBase.endsWith('/api') ? cleanBase : `${cleanBase}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("🔗 Final API Base URL:", API.defaults.baseURL);

let requestInterceptorId = null;

export const setupAxiosInterceptors = (getToken) => {
  if (requestInterceptorId !== null) {
    API.interceptors.request.eject(requestInterceptorId);
  }

  requestInterceptorId = API.interceptors.request.use(
    async (config) => {
      try {
        if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }

        let token = null;
        if (typeof getToken === 'function') {
          token = await getToken({ skipCache: true });
        } else {
          token = localStorage.getItem('token');
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Failed to attach auth token:', err);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return () => {
    if (requestInterceptorId !== null) {
      API.interceptors.request.eject(requestInterceptorId);
      requestInterceptorId = null;
    }
  };
};

/* ==========================================================================
   Apartments Endpoints
   ========================================================================== */
export const fetchApartments = (tower) => API.get('/apartments', { params: { tower } });
export const fetchApartmentById = (id) => API.get(`/apartments/${id}`);
export const createApartment = (formData) => API.post('/apartments', formData);
export const updateApartment = (id, formData) => API.put(`/apartments/${id}`, formData);
export const deleteApartment = (id) => API.delete(`/apartments/${id}`);

/* ==========================================================================
   Bookings & Analytics Endpoints
   ========================================================================== */
export const createBooking = (bookingData) => API.post('/bookings', bookingData);
export const fetchUserBookings = (userId) => API.get('/bookings', { params: { userId } });
export const cancelBooking = (id) => API.patch(`/bookings/${id}/cancel`);
export const fetchAllBookings = () => API.get('/bookings');
export const updateBookingStatus = (id, status) => API.patch(`/bookings/${id}/status`, { status });
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);
export const fetchAnalytics = () => API.get('/bookings/analytics');
export const fetchUserRole = (clerkId) => API.get(`/users/role/${encodeURIComponent(clerkId)}`);
export const syncUserProfile = (profile) => API.post('/users/sync', profile);

/* ==========================================================================
   Messages & Contact Endpoints
   ========================================================================== */
export const sendContactMessage = (formData) => API.post('/messages', formData);
export const fetchMessages = () => API.get('/messages');
export const markMessageAsRead = (id) => API.patch(`/messages/${id}/read`);


export default API;
