import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 API Request:', config.method.toUpperCase(), config.url, {
        data: config.data,
        params: config.params
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ API Response:', response.status, response.config.url, response.data)
    }
    
    return response
  },
  (error) => {
    // Log errors
    if (error.response) {
      console.error('❌ API Error:', {
        status: error.response.status,
        message: error.response.data?.message || 'Request failed',
        url: error.config?.url,
        data: error.response.data
      })
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Unauthorized - redirect to login or clear auth
        localStorage.removeItem('token')
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login'
        }
      } else if (error.response.status >= 500) {
        console.error('Server error - please try again later')
      }
    } else if (error.request) {
      console.error('❌ Network Error:', error.message)
    } else {
      console.error('❌ Request Setup Error:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Generic API call function
const apiCall = (method, endpoint, data = null, config = {}) => {
  return api({
    method,
    url: endpoint,
    data,
    ...config
  })
}

// Auth token management
const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('token', token)
  }
}

const clearAuthToken = () => {
  delete api.defaults.headers.common['Authorization']
  localStorage.removeItem('token')
}

// API methods
export default {
  // Auth endpoints - FIXED: Consistent endpoints
  login: (credentials) => apiCall('POST', '/auth/login', credentials),
  register: (userData) => apiCall('POST', '/auth/register', userData),
  getCurrentUser: () => apiCall('GET', '/auth/me'),
  updateProfile: (profileData) => apiCall('PUT', '/auth/profile', profileData),

  // User profile endpoints
  getProfile: () => apiCall('GET', '/users/profile'),
  getUserBookings: () => apiCall('GET', '/users/bookings'),

  // Camping spots endpoints
  getSpots: (params = {}) => apiCall('GET', '/spots', null, { params }),
  getSpot: (id) => apiCall('GET', `/spots/${id}`),
  createSpot: (spotData) => apiCall('POST', '/spots', spotData),
  updateSpot: (id, spotData) => apiCall('PUT', `/spots/${id}`, spotData),
  deleteSpot: (id) => apiCall('DELETE', `/spots/${id}`),

  // Owner endpoints
  getOwnerSpots: () => apiCall('GET', '/owners/spots'),
  getOwnerBookings: () => apiCall('GET', '/owners/bookings'),

  // Booking endpoints
  getBookings: () => apiCall('GET', '/bookings'),
  getBooking: (id) => apiCall('GET', `/bookings/${id}`),
  createBooking: (bookingData) => apiCall('POST', '/bookings', bookingData),
  updateBooking: (id, bookingData) => apiCall('PUT', `/bookings/${id}`, bookingData),
  cancelBooking: (id, reason = '') => apiCall('PUT', `/bookings/${id}/cancel`, { reason }),

  // Review endpoints
  getSpotReviews: (spotId, params = {}) => apiCall('GET', `/spots/${spotId}/reviews`, null, { params }),
  createReview: (bookingId, reviewData) => apiCall('POST', `/bookings/${bookingId}/review`, reviewData),

  // Admin endpoints
  getAdminDashboard: () => apiCall('GET', '/admin/dashboard'),
  getAdminUsers: (params = {}) => apiCall('GET', '/admin/users', null, { params }),
  updateAdminUser: (id, userData) => apiCall('PUT', `/admin/users/${id}`, userData),
  deleteAdminUser: (id) => apiCall('DELETE', `/admin/users/${id}`),
  getAdminSpots: (params = {}) => apiCall('GET', '/admin/spots', null, { params }),
  updateAdminSpot: (id, spotData) => apiCall('PUT', `/admin/spots/${id}`, spotData),
  getAdminBookings: (params = {}) => apiCall('GET', '/admin/bookings', null, { params }),

  // Utility endpoints
  healthCheck: () => apiCall('GET', '/'),
  testDatabase: () => apiCall('GET', '/test-db'),

  // Search and filter endpoints
  searchSpots: (query) => apiCall('GET', `/spots`, null, { params: { search: query } }),
  getPopularSpots: (limit = 6) => apiCall('GET', `/spots`, null, { params: { limit, sortBy: 'averageRating', sortOrder: 'desc' } }),
  getFeaturedSpots: (limit = 6) => apiCall('GET', `/spots`, null, { params: { limit, featured: true } }),

  // Token management utilities
  setAuthToken,
  clearAuthToken,
  
  // Get current auth token
  getAuthToken: () => localStorage.getItem('token'),
  
  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token'),

  // Axios instance for direct access if needed
  instance: api
}