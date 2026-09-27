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

        const skipAuth = Boolean(config.skipAuth);
        delete config.skipAuth;

        let token = null;
        if (!skipAuth && typeof getToken === 'function') {
          token = await getToken();
        } else if (!skipAuth) {
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
const responseCache = new Map();
const pendingRequests = new Map();
const ADMIN_CACHE_TTL_MS = 60_000;

const cachedGet = (key, request) => {
  const cached = responseCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.response);
  if (pendingRequests.has(key)) return pendingRequests.get(key);

  const pending = request()
    .then((response) => {
      responseCache.set(key, { response, expiresAt: Date.now() + ADMIN_CACHE_TTL_MS });
      return response;
    })
    .finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, pending);
  return pending;
};

const invalidateCache = (...keys) => {
  keys.forEach((key) => responseCache.delete(key));
  if (keys.includes('apartments:all')) {
    for (const key of responseCache.keys()) {
      if (key.startsWith('apartments:')) responseCache.delete(key);
    }
  }
};
const apartmentsCacheKey = (tower) => `apartments:${tower || 'all'}`;

export const fetchApartments = (tower) =>
  cachedGet(apartmentsCacheKey(tower), () =>
    API.get('/apartments', { params: { tower }, skipAuth: true })
  );
export const fetchApartmentById = (id) => API.get(`/apartments/${id}`, { skipAuth: true });
export const createApartment = async (formData) => {
  const response = await API.post('/apartments', formData);
  invalidateCache('apartments:all');
  return response;
};
export const updateApartment = async (id, formData) => {
  const response = await API.put(`/apartments/${id}`, formData);
  invalidateCache('apartments:all');
  return response;
};
export const deleteApartment = async (id) => {
  const response = await API.delete(`/apartments/${id}`);
  invalidateCache('apartments:all');
  return response;
};

/* ==========================================================================
   Bookings & Analytics Endpoints
   ========================================================================== */
const invalidateBookingCache = () => invalidateCache('admin:bookings', 'admin:analytics');

export const createBooking = async (bookingData) => {
  const response = await API.post('/bookings', bookingData);
  invalidateBookingCache();
  return response;
};
export const fetchUserBookings = (userId) => API.get('/bookings', { params: { userId } });
export const fetchApartmentBookings = (apartmentId) =>
  API.get(`/bookings/apartment/${encodeURIComponent(apartmentId)}`, { skipAuth: true });
export const cancelBooking = async (id) => {
  const response = await API.patch(`/bookings/${id}/cancel`);
  invalidateBookingCache();
  return response;
};
export const fetchAllBookings = () => cachedGet('admin:bookings', () => API.get('/bookings'));
export const updateBookingStatus = async (id, status) => {
  const response = await API.patch(`/bookings/${id}/status`, { status });
  invalidateBookingCache();
  return response;
};
export const deleteBooking = async (id) => {
  const response = await API.delete(`/bookings/${id}`);
  invalidateBookingCache();
  return response;
};
export const fetchAnalytics = () => cachedGet('admin:analytics', () => API.get('/bookings/analytics'));
export const fetchUserRole = (clerkId) => API.get(`/users/role/${encodeURIComponent(clerkId)}`);
export const syncUserProfile = (profile) => API.post('/users/sync', profile);

export const prefetchAdminData = () => {
  fetchAnalytics();
  const later = typeof requestIdleCallback === 'function'
    ? (cb) => requestIdleCallback(cb, { timeout: 1200 })
    : (cb) => setTimeout(cb, 400);
  later(() => {
    fetchAllBookings();
    fetchApartments();
  });
};

/* ==========================================================================
   Messages & Contact Endpoints
   ========================================================================== */
export const sendContactMessage = (formData) =>
  API.post('/messages', formData).then((response) => {
    invalidateCache('admin:messages');
    return response;
  });
export const fetchMessages = () => cachedGet('admin:messages', () => API.get('/messages'));
export const markMessageAsRead = async (id) => {
  const response = await API.patch(`/messages/${id}/read`);
  invalidateCache('admin:messages');
  return response;
};


export default API;
