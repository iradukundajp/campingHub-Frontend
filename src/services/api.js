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
  // ===== AUTHENTICATION ENDPOINTS =====
  login: (credentials) => apiCall('POST', '/auth/login', credentials),
  register: (userData) => apiCall('POST', '/auth/register', userData),
  getCurrentUser: () => apiCall('GET', '/auth/me'),
  updateProfile: (profileData) => apiCall('PUT', '/auth/profile', profileData),

  // ===== USER ENDPOINTS =====
  getProfile: () => apiCall('GET', '/users/profile'),
  updateUserProfile: (profileData) => apiCall('PUT', '/users/profile', profileData),
  getUserBookings: (params = {}) => apiCall('GET', '/users/bookings', null, { params }),
  getUserReviews: (params = {}) => apiCall('GET', '/users/reviews', null, { params }),
  getUserStats: () => apiCall('GET', '/users/stats'),
  requestVerification: () => apiCall('PUT', '/users/verification'),
  deleteAccount: (data) => apiCall('DELETE', '/users/account', data),

  // ===== CAMPING SPOTS ENDPOINTS =====
  getSpots: (params = {}) => apiCall('GET', '/spots', null, { params }),
  getSpot: (id) => apiCall('GET', `/spots/${id}`),
  createSpot: (spotData) => apiCall('POST', '/spots', spotData),
  updateSpot: (id, spotData) => apiCall('PUT', `/spots/${id}`, spotData),
  deleteSpot: (id) => apiCall('DELETE', `/spots/${id}`),

  // ===== BOOKING ENDPOINTS =====
  getBookings: (params = {}) => apiCall('GET', '/bookings', null, { params }),
  getBooking: (id) => apiCall('GET', `/bookings/${id}`),
  createBooking: (bookingData) => apiCall('POST', '/bookings', bookingData),
  cancelBooking: (id, reason = '') => apiCall('PUT', `/bookings/${id}/cancel`, { reason }),
  updatePaymentStatus: (id, paymentData) => apiCall('PUT', `/bookings/${id}/payment`, paymentData),
  addReview: (bookingId, reviewData) => apiCall('POST', `/bookings/${bookingId}/review`, reviewData),

  // ===== OWNER ENDPOINTS =====
  getOwnerSpots: (params = {}) => apiCall('GET', '/owners/spots', null, { params }),
  createOwnerSpot: (spotData) => apiCall('POST', '/owners/spots', spotData),
  updateOwnerSpot: (id, spotData) => apiCall('PUT', `/owners/spots/${id}`, spotData),
  deleteOwnerSpot: (id) => apiCall('DELETE', `/owners/spots/${id}`),
  getOwnerBookings: (params = {}) => apiCall('GET', '/owners/bookings', null, { params }),
  updateOwnerBooking: (id, bookingData) => apiCall('PUT', `/owners/bookings/${id}`, bookingData),
  getOwnerDashboard: () => apiCall('GET', '/owners/dashboard'),

  // ===== ADMIN ENDPOINTS =====
  getAdminDashboard: () => apiCall('GET', '/admin/dashboard'),
  
  // Admin Users
  getAdminUsers: (params = {}) => apiCall('GET', '/admin/users', null, { params }),
  updateAdminUser: (id, userData) => apiCall('PUT', `/admin/users/${id}`, userData),
  deleteAdminUser: (id) => apiCall('DELETE', `/admin/users/${id}`),
  
  // Admin Spots
  getAdminSpots: (params = {}) => apiCall('GET', '/admin/spots', null, { params }),
  updateAdminSpot: (id, spotData) => apiCall('PUT', `/admin/spots/${id}`, spotData),
  
  // Admin Bookings
  getAdminBookings: (params = {}) => apiCall('GET', '/admin/bookings', null, { params }),
  updateAdminBooking: (id, bookingData) => apiCall('PUT', `/admin/bookings/${id}`, bookingData),
  
  // Admin Analytics
  getAdminAnalytics: (params = {}) => apiCall('GET', '/admin/analytics', null, { params }),

  // ===== UTILITY ENDPOINTS =====
  healthCheck: () => apiCall('GET', '/'),
  testDatabase: () => apiCall('GET', '/test-db'),

  // ===== SEARCH AND FILTER ENDPOINTS =====
  searchSpots: (query, params = {}) => apiCall('GET', `/spots`, null, { 
    params: { search: query, ...params } 
  }),
  getPopularSpots: (limit = 6) => apiCall('GET', `/spots`, null, { 
    params: { limit, sortBy: 'averageRating', sortOrder: 'desc' } 
  }),
  getFeaturedSpots: (limit = 6, params = {}) => apiCall('GET', `/spots`, null, { 
    params: { limit, featured: true, ...params } 
  }),
  getSpotsByLocation: (location, params = {}) => apiCall('GET', `/spots`, null, { 
    params: { location, ...params } 
  }),
  getSpotsByPriceRange: (minPrice, maxPrice, params = {}) => apiCall('GET', `/spots`, null, { 
    params: { minPrice, maxPrice, ...params } 
  }),
  getSpotsByCapacity: (capacity, params = {}) => apiCall('GET', `/spots`, null, { 
    params: { capacity, ...params } 
  }),

  // ===== SPECIALIZED BOOKING METHODS =====
  checkAvailability: (spotId, checkIn, checkOut) => apiCall('GET', `/spots/${spotId}`, null, {
    params: { checkIn, checkOut }
  }),
  getBookingHistory: (params = {}) => apiCall('GET', '/bookings', null, { 
    params: { ...params, status: 'COMPLETED' } 
  }),
  getPendingBookings: (params = {}) => apiCall('GET', '/bookings', null, { 
    params: { ...params, status: 'PENDING' } 
  }),
  getConfirmedBookings: (params = {}) => apiCall('GET', '/bookings', null, { 
    params: { ...params, status: 'CONFIRMED' } 
  }),

  // ===== REVIEW METHODS =====
  getSpotReviews: (spotId, params = {}) => apiCall('GET', `/spots/${spotId}`, null, { params }),
  canReviewSpot: (spotId) => apiCall('GET', `/spots/${spotId}`),

  // ===== PAYMENT METHODS =====
  processPayment: (bookingId, paymentData) => apiCall('PUT', `/bookings/${bookingId}/payment`, {
    paymentStatus: 'PAID',
    ...paymentData
  }),
  refundPayment: (bookingId, refundData) => apiCall('PUT', `/bookings/${bookingId}/payment`, {
    paymentStatus: 'REFUNDED',
    ...refundData
  }),

  // ===== OWNER SPECIFIC METHODS =====
  approveBooking: (bookingId, notes = '') => apiCall('PUT', `/owners/bookings/${bookingId}`, {
    status: 'CONFIRMED',
    notes
  }),
  rejectBooking: (bookingId, notes = '') => apiCall('PUT', `/owners/bookings/${bookingId}`, {
    status: 'CANCELLED',
    notes
  }),

  // ===== ANALYTICS AND REPORTING =====
  getBookingAnalytics: (period = '30days') => apiCall('GET', '/admin/analytics', null, {
    params: { period }
  }),
  getRevenueReport: (startDate, endDate) => apiCall('GET', '/admin/analytics', null, {
    params: { period: 'custom', startDate, endDate }
  }),

  // ===== FILE UPLOAD UTILITIES =====
  uploadImage: (file, type = 'spot') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)
    
    return apiCall('POST', '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // ===== TOKEN MANAGEMENT UTILITIES =====
  setAuthToken,
  clearAuthToken,
  
  // Get current auth token
  getAuthToken: () => localStorage.getItem('token'),
  
  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token'),

  // ===== VALIDATION UTILITIES =====
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  validatePhone: (phone) => {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/[\s\-()]/g, ''))
  },
  
  validatePassword: (password) => {
    return password && password.length >= 6
  },

  // ===== ERROR HANDLING UTILITIES =====
  handleApiError: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    } else if (error.message) {
      return error.message
    } else {
      return 'An unexpected error occurred'
    }
  },

  // ===== AXIOS INSTANCE =====
  // Axios instance for direct access if needed
  instance: api,
  
  // Raw axios for custom requests
  axios: api
}