<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-6">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.84L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.84l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <span class="text-2xl font-bold text-gray-900">CampingHub</span>
        </router-link>
        
        <h2 class="text-3xl font-bold text-gray-900">Join CampingHub</h2>
        <p class="mt-2 text-sm text-gray-600">
          Create an account and start your camping adventures
        </p>
      </div>

      <!-- Register Form -->
      <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
        <!-- Error Message -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <svg class="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm text-red-800">{{ error }}</p>
          </div>
        </div>

        <!-- Account Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Account Type</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              @click="form.role = 'USER'"
              :class="form.role === 'USER' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'"
              class="flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              </svg>
              Camper
            </button>
            <button
              type="button"
              @click="form.role = 'OWNER'"
              :class="form.role === 'OWNER' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300'"
              class="flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-colors"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
              Owner
            </button>
          </div>
          <p class="mt-2 text-xs text-gray-500">
            Choose "Camper" to book spots or "Owner" to list your camping sites
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': firstNameError }"
              placeholder="John"
              @blur="validateFirstName"
            >
            <p v-if="firstNameError" class="mt-1 text-sm text-red-600">{{ firstNameError }}</p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': lastNameError }"
              placeholder="Doe"
              @blur="validateLastName"
            >
            <p v-if="lastNameError" class="mt-1 text-sm text-red-600">{{ lastNameError }}</p>
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': emailError }"
            placeholder="john@example.com"
            @blur="validateEmail"
          >
          <p v-if="emailError" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
        </div>

        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="new-password"
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': passwordError }"
              placeholder="Create a password"
              @blur="validatePassword"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">{{ passwordError }}</p>
          <p class="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': confirmPasswordError }"
            placeholder="Confirm your password"
            @blur="validateConfirmPassword"
          >
          <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-600">{{ confirmPasswordError }}</p>
        </div>

        <!-- Terms & Privacy -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              id="terms"
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            >
          </div>
          <div class="ml-3 text-sm">
            <label for="terms" class="text-gray-700">
              I agree to the 
              <a href="#" class="text-primary hover:text-primary-dark font-medium">Terms of Service</a>
              and 
              <a href="#" class="text-primary hover:text-primary-dark font-medium">Privacy Policy</a>
            </label>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <!-- Login Link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="font-medium text-primary hover:text-primary-dark transition-colors">
              Sign in here
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'USER',
  agreeToTerms: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

const isFormValid = computed(() => {
  return form.value.firstName && 
         form.value.lastName &&
         form.value.email && 
         form.value.password && 
         form.value.confirmPassword &&
         form.value.agreeToTerms &&
         !firstNameError.value &&
         !lastNameError.value &&
         !emailError.value && 
         !passwordError.value &&
         !confirmPasswordError.value
})

const validateFirstName = () => {
  if (!form.value.firstName) {
    firstNameError.value = 'First name is required'
  } else if (form.value.firstName.length < 2) {
    firstNameError.value = 'First name must be at least 2 characters'
  } else {
    firstNameError.value = ''
  }
}

const validateLastName = () => {
  if (!form.value.lastName) {
    lastNameError.value = 'Last name is required'
  } else if (form.value.lastName.length < 2) {
    lastNameError.value = 'Last name must be at least 2 characters'
  } else {
    lastNameError.value = ''
  }
}

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    emailError.value = 'Email is required'
  } else if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Please enter a valid email address'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Password is required'
  } else if (form.value.password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
  
  // Re-validate confirm password if it exists
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    confirmPasswordError.value = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    confirmPasswordError.value = 'Passwords do not match'
  } else {
    confirmPasswordError.value = ''
  }
}

const handleSubmit = async () => {
  // Validate all fields
  validateFirstName()
  validateLastName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  
  if (!isFormValid.value) return

  loading.value = true
  error.value = ''

  try {
    const result = await authStore.register({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      role: form.value.role
    })

    if (result.success) {
      // Redirect to home or intended page
      router.push('/')
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>