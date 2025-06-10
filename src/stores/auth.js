import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: false,
    verificationSent: false
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
    
    // User display information
    userFullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`.trim()
    },
    
    userInitials: (state) => {
      if (!state.user) return ''
      const first = state.user.firstName?.charAt(0) || ''
      const last = state.user.lastName?.charAt(0) || ''
      return `${first}${last}`.toUpperCase()
    },

    // User status getters
    isVerified: (state) => {
      return state.isAuthenticated && state.user?.isVerified
    },

    isActive: (state) => {
      return state.isAuthenticated && state.user?.isActive
    },

    // User profile completion
    profileCompleteness: (state) => {
      if (!state.user) return 0
      
      let completed = 0
      const fields = ['firstName', 'lastName', 'email', 'phone', 'avatar']
      
      fields.forEach(field => {
        if (state.user[field] && state.user[field].trim()) {
          completed++
        }
      })
      
      return Math.round((completed / fields.length) * 100)
    },

    // Check if profile needs completion
    needsProfileCompletion: (state) => {
      return state.profileCompleteness < 60
    },

    // User avatar or initials
    userAvatar: (state) => {
      return state.user?.avatar || null
    },

    // Formatted user info for display
    userDisplayInfo: (state) => {
      if (!state.user) return null
      
      return {
        name: state.userFullName,
        initials: state.userInitials,
        email: state.user.email,
        phone: state.user.phone,
        avatar: state.user.avatar,
        role: state.user.role,
        isVerified: state.user.isVerified,
        isActive: state.user.isActive,
        memberSince: state.user.createdAt
      }
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
        
        // Validate required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password) {
          throw new Error('All required fields must be provided')
        }
        
        // Validate email format
        if (!api.validateEmail(userData.email)) {
          throw new Error('Please provide a valid email address')
        }
        
        // Validate password strength
        if (!api.validatePassword(userData.password)) {
          throw new Error('Password must be at least 6 characters long')
        }
        
        // Validate phone if provided
        if (userData.phone && !api.validatePhone(userData.phone)) {
          throw new Error('Please provide a valid phone number')
        }
        
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
        // Validate profile data
        if (profileData.firstName && profileData.firstName.trim().length < 2) {
          throw new Error('First name must be at least 2 characters long')
        }
        
        if (profileData.lastName && profileData.lastName.trim().length < 2) {
          throw new Error('Last name must be at least 2 characters long')
        }
        
        if (profileData.phone && !api.validatePhone(profileData.phone)) {
          throw new Error('Please provide a valid phone number')
        }
        
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

    async requestVerification() {
      this.loading = true
      
      try {
        const response = await api.requestVerification()
        
        this.verificationSent = true
        
        return { 
          success: true, 
          message: response.data.message || 'Verification email sent successfully' 
        }
      } catch (error) {
        console.error('Request verification error:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to send verification email.'
        
        return { success: false, error: errorMessage }
      } finally {
        this.loading = false
      }
    },

    async deleteAccount(password, reason = '') {
      this.loading = true
      
      try {
        if (!password) {
          throw new Error('Password is required to delete account')
        }
        
        const response = await api.deleteAccount({ password, reason })
        
        // Clear auth after successful deletion
        this.clearAuth()
        
        return { 
          success: true, 
          message: response.data.message || 'Account deleted successfully' 
        }
      } catch (error) {
        console.error('Delete account error:', error)
        
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to delete account.'
        
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
      this.verificationSent = false
      
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
      
      // Check if account is active
      if (routeMeta.requiresActive && !this.isActive) {
        return false
      }
      
      // Check if account is verified
      if (routeMeta.requiresVerified && !this.isVerified) {
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
    },

    // Get user permissions
    getUserPermissions() {
      if (!this.isAuthenticated) {
        return []
      }
      
      const permissions = ['read:profile', 'update:profile']
      
      if (this.isUser || this.isOwner || this.isAdmin) {
        permissions.push('create:booking', 'read:bookings', 'cancel:booking', 'create:review')
      }
      
      if (this.isOwner || this.isAdmin) {
        permissions.push(
          'create:spot', 'read:spots', 'update:spot', 'delete:spot',
          'read:owner_bookings', 'update:booking_status'
        )
      }
      
      if (this.isAdmin) {
        permissions.push(
          'read:all_users', 'update:user', 'delete:user',
          'read:all_spots', 'update:any_spot',
          'read:all_bookings', 'update:any_booking',
          'read:analytics'
        )
      }
      
      return permissions
    },

    // Check if user has specific permission
    hasPermission(permission) {
      return this.getUserPermissions().includes(permission)
    },

    // Refresh user data
    async refreshUser() {
      if (this.isAuthenticated) {
        return await this.fetchUser()
      }
      return false
    }
  }
})