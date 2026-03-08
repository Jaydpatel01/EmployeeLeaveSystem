<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
    <div class="max-w-md w-full">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p class="text-gray-500 mt-2">Sign in to the Leave Management System</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all', fieldError('email') ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
              @blur="touchField('email')"
            />
            <p v-if="fieldError('email')" class="text-red-500 text-xs mt-1">{{ fieldError('email') }}</p>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all pr-10', fieldError('password') ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
                @blur="touchField('password')"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15.12 15.12L21 21"/></svg>
              </button>
            </div>
            <p v-if="fieldError('password')" class="text-red-500 text-xs mt-1">{{ fieldError('password') }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Don't have an account?
            <router-link to="/register" class="text-indigo-600 hover:text-indigo-700 font-semibold">Create one</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: '',
      loading: false,
      touched: {},
    };
  },
  computed: {
    errors() {
      const e = {};
      if (this.touched.email) {
        if (!this.email) e.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(this.email)) e.email = 'Please enter a valid email address.';
      }
      if (this.touched.password) {
        if (!this.password) e.password = 'Password is required.';
      }
      return e;
    },
    isFormValid() {
      return this.email && EMAIL_REGEX.test(this.email) && this.password;
    },
  },
  methods: {
    touchField(field) {
      this.touched = { ...this.touched, [field]: true };
    },
    fieldError(field) {
      return this.errors[field] || '';
    },
    async handleLogin() {
      this.touched = { email: true, password: true };
      if (!this.isFormValid) return;

      this.error = '';
      this.loading = true;
      try {
        const { data } = await api.post('/auth/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        this.$router.push(data.user.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard');
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
