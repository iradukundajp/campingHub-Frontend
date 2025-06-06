import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000
})

export default {
  // Auth endpoints
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  
  // Spots endpoints
  getSpots: (params = {}) => api.get('/spots', { params }),
  getSpot: (id) => api.get(`/spots/${id}`)
}