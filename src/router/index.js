import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Views - all imports are now available
const HomeView = () => import('@/views/HomeView.vue')
const CampingSpotsView = () => import('@/views/CampingSpotsView.vue')
const SpotDetailView = () => import('@/views/SpotDetailView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const OwnerDashboardView = () => import('@/views/OwnerDashboardView.vue')
const AdminDashboardView = () => import('@/views/AdminDashboardView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')

// FIXED: Added missing view imports
const BookingView = () => import('@/views/BookingView.vue')
const UserBookingsView = () => import('@/views/UserBookingsView.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/spots',
    name: 'CampingSpots',
    component: CampingSpotsView
  },
  {
    path: '/spots/:id',
    name: 'SpotDetail',
    component: SpotDetailView,
    props: true
  },
  // FIXED: Uncommented and fixed BookingView route
  {
    path: '/book/:id',
    name: 'Booking',
    component: BookingView,
    props: true,
    meta: { requiresAuth: true }
  },
  // FIXED: Uncommented and fixed UserBookingsView route
  {
    path: '/bookings',
    name: 'UserBookings',
    component: UserBookingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/owner',
    name: 'OwnerDashboard',
    component: OwnerDashboardView,
    meta: { 
      requiresAuth: true, 
      requiresOwner: true 
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { 
      requiresAuth: true, 
      requiresAdmin: true 
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards with Admin Support
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ 
      name: 'Login', 
      query: { redirect: to.fullPath } 
    })
    return
  }
  
  // Check if route requires guest (not logged in)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }
  
  // Check if route requires owner role
  if (to.meta.requiresOwner) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (authStore.user?.role !== 'OWNER' && authStore.user?.role !== 'ADMIN') {
      next({ name: 'Home' })
      return
    }
  }
  
  // Check if route requires admin role
  if (to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (authStore.user?.role !== 'ADMIN') {
      next({ name: 'Home' })
      return
    }
  }
  
  // Check if user has required permissions
  if (to.meta.requiresRole) {
    if (!authStore.isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (!to.meta.requiresRole.includes(authStore.user?.role)) {
      next({ name: 'Home' })
      return
    }
  }
  
  next()
})

// Update page title based on route
router.afterEach((to) => {
  const baseTitle = 'CampingHub'
  
  const routeTitles = {
    Home: 'Find Your Perfect Camping Spot',
    CampingSpots: 'Camping Spots',
    SpotDetail: 'Spot Details',
    Booking: 'Book Your Stay',
    UserBookings: 'My Bookings',
    Profile: 'My Profile',
    OwnerDashboard: 'Owner Dashboard',
    AdminDashboard: 'Admin Dashboard',
    Login: 'Sign In',
    Register: 'Sign Up'
  }
  
  const routeTitle = routeTitles[to.name] || 'Page'
  document.title = `${routeTitle} | ${baseTitle}`
})

export default router