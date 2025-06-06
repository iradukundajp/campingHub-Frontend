import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isOwner: (state) => state.user?.role === 'OWNER',
    isAdmin: (state) => state.user?.role === 'ADMIN'
  },
  
  actions: {
    async login(credentials) {
      // TODO: Implement login
      return { success: true }
    },
    
    async register(userData) {
      // TODO: Implement register
      return { success: true }
    },
    
    logout() {
      this.user = null
      this.token = null
    }
  }
})