import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    // Role checking getters
    isAdmin: (state) => {
      return state.isAuthenticated && state.user?.role === 'ADMIN'
    },
    
    isOwner: (state) => {
      return state.isAuthenticated && state.user?.role === 'OWNER'
    },
    
    isUser: (state) => {
      return state.isAuthenticated && state.user?.role === 'USER'
    },
    
    // Helper to check if user has specific role
    hasRole: (state) => (role) => {
      return state.isAuthenticated && state.user?.role === role
    },
    
    // Helper to check if user has any of the specified roles
    hasAnyRole: (state) => (roles) => {
      return state.isAuthenticated && roles.includes(state.user?.role)
    },
    
    userFullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },
    
    userInitials: (state) => {
      if (!state.user) return ''
      const first = state.user.firstName?.charAt(0) || ''
      const last = state.user.lastName?.charAt(0) || ''
      return `${first}${last}`.toUpperCase()
    }
  },

  actions: {
    async login(credentials) {
      this.loading = true
      
      try {
        console.log('Attempting login with:', credentials.email)
        const response = await api.login(credentials)
        
        console.log('Login response:', response.data)
        
        if (response.data && response.data.token && response.data.user) {
          this.token = response.data.token
          this.user = response.data.user
          this.isAuthenticated = true
          
          // Store token in localStorage
          localStorage.setItem('token', this.token)
          
          // Set default authorization header for future requests
          api.setAuthToken(this.token)
          
          console.log('Login successful for user:', this.user.email)
          return { success: true, user: this.user }
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Login error:', error)
        
        // Clear any existing auth data
        this.clearAuth()
        
        let errorMessage = 'Login failed. Please try again.'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      
      try {
        console.log('Attempting registration for:', userData.email)
        const response = await api.register(userData)
        
        console.log('Registration response:', response.data)
        
        if (response.data && response.data.token && response.data.user) {
          this.token = response.data.token
          this.user = response.data.user
          this.isAuthenticated = true
          
          // Store token in localStorage
          localStorage.setItem('token', this.token)
          
          // Set default authorization header for future requests
          api.setAuthToken(this.token)
          
          console.log('Registration successful for user:', this.user.email)
          return { success: true, user: this.user }
        } else {
          throw new Error('Invalid response format from server')
        }
      } catch (error) {
        console.error('Registration error:', error)
        
        // Clear any existing auth data
        this.clearAuth()
        
        let errorMessage = 'Registration failed. Please try again.'
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      if (!this.token) {
        console.log('No token found, clearing auth')
        this.clearAuth()
        return false
      }

      this.loading = true
      
      try {
        console.log('Fetching current user with token:', this.token.substring(0, 20) + '...')
        
        // Set the token for the request
        api.setAuthToken(this.token)
        
        const response = await api.getCurrentUser()
        
        console.log('Fetch user response:', response.data)
        
        if (response.data && response.data.user) {
          this.user = response.data.user
          this.isAuthenticated = true
          console.log('User fetched successfully:', this.user.email)
          return true
        } else {
          throw new Error('Failed to fetch user data')
        }
      } catch (error) {
        console.error('Fetch user error:', error)
        
        // If token is invalid, clear auth data
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log('Token invalid, clearing auth')
          this.clearAuth()
        }
        
        return false
      } finally {
        this.loading = false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      
      try {
        const response = await api.updateProfile(profileData)
        
        if (response.data && response.data.user) {
          this.user = { ...this.user, ...response.data.user }
          return { success: true, user: this.user }
        } else {
          throw new Error('Failed to update profile')
        }
      } catch (error) {
        console.error('Update profile error:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to update profile.'
        
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    logout() {
      console.log('Logging out user')
      this.clearAuth()
      
      // Redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    },

    clearAuth() {
      console.log('Clearing authentication data')
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // Remove token from localStorage
      localStorage.removeItem('token')
      
      // Clear authorization header
      api.clearAuthToken()
    },

    // Initialize auth state from localStorage
    async initializeAuth() {
      const token = localStorage.getItem('token')
      
      console.log('Initializing auth, token found:', !!token)
      
      if (token) {
        this.token = token
        const success = await this.fetchUser()
        
        if (!success) {
          // Token is invalid, clear it
          console.log('Token validation failed during initialization')
          this.clearAuth()
        }
      } else {
        console.log('No token found during initialization')
      }
    },

    // Check if user can access a specific route
    canAccess(routeMeta) {
      if (!routeMeta) return true
      
      // Check authentication requirement
      if (routeMeta.requiresAuth && !this.isAuthenticated) {
        return false
      }
      
      // Check guest requirement (not logged in)
      if (routeMeta.requiresGuest && this.isAuthenticated) {
        return false
      }
      
      // Check specific role requirements
      if (routeMeta.requiresAdmin && !this.isAdmin) {
        return false
      }
      
      if (routeMeta.requiresOwner && !this.isOwner && !this.isAdmin) {
        return false
      }
      
      // Check general role requirements
      if (routeMeta.requiresRole && !this.hasAnyRole(routeMeta.requiresRole)) {
        return false
      }
      
      return true
    },

    // Get appropriate dashboard route for user
    getDashboardRoute() {
      if (!this.isAuthenticated) {
        return '/'
      }
      
      if (this.isAdmin) {
        return '/admin'
      }
      
      if (this.isOwner) {
        return '/owner'
      }
      
      return '/profile'
    }
  }
})