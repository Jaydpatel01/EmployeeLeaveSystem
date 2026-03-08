<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4 py-8">
    <div class="max-w-md w-full">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
        <p class="text-gray-500 mt-2">Join the Leave Management System</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <!-- Error Alert -->
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-2">
          <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5" novalidate>
          <!-- Full Name -->
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              id="name"
              v-model.trim="name"
              type="text"
              autocomplete="name"
              placeholder="John Doe"
              :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all', fieldError('name') ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
              @blur="touchField('name')"
            />
            <p v-if="fieldError('name')" class="text-red-500 text-xs mt-1">{{ fieldError('name') }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              id="email"
              v-model.trim="email"
              type="email"
              autocomplete="email"
              placeholder="you@company.com"
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
                autocomplete="new-password"
                placeholder="Min. 6 characters"
                :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all pr-10', fieldError('password') ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
                @blur="touchField('password')"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M15.12 15.12L21 21"/></svg>
              </button>
            </div>
            <p v-if="fieldError('password')" class="text-red-500 text-xs mt-1">{{ fieldError('password') }}</p>
            <!-- Password strength -->
            <div v-if="password && touched.password" class="mt-2">
              <div class="flex gap-1">
                <div v-for="i in 4" :key="i" :class="['h-1.5 flex-1 rounded-full', i <= passwordStrength ? strengthColor : 'bg-gray-200']"></div>
              </div>
              <p :class="['text-xs mt-1', strengthTextColor]">{{ strengthText }}</p>
            </div>
          </div>

          <!-- Confirm Password -->
          <div>
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Re-enter your password"
              :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all', fieldError('confirmPassword') ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
              @blur="touchField('confirmPassword')"
            />
            <p v-if="fieldError('confirmPassword')" class="text-red-500 text-xs mt-1">{{ fieldError('confirmPassword') }}</p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" class="block text-sm font-semibold text-gray-700 mb-1">I am an</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="role = 'employee'; touchField('role')"
                :class="['px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer text-center', role === 'employee' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
              >
                <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Employee
              </button>
              <button
                type="button"
                @click="role = 'employer'; touchField('role')"
                :class="['px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all cursor-pointer text-center', role === 'employer' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-gray-300']"
              >
                <svg class="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                Employer
              </button>
            </div>
            <p v-if="fieldError('role')" class="text-red-500 text-xs mt-1">{{ fieldError('role') }}</p>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            Already have an account?
            <router-link to="/login" class="text-indigo-600 hover:text-indigo-700 font-semibold">Sign in</router-link>
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
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      showPassword: false,
      error: '',
      loading: false,
      touched: {},
    };
  },
  computed: {
    passwordStrength() {
      let s = 0;
      if (this.password.length >= 6) s++;
      if (this.password.length >= 8) s++;
      if (/[A-Z]/.test(this.password) && /[0-9]/.test(this.password)) s++;
      if (/[^A-Za-z0-9]/.test(this.password)) s++;
      return s;
    },
    strengthColor() {
      const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
      return colors[this.passwordStrength - 1] || 'bg-gray-200';
    },
    strengthText() {
      const texts = ['Weak', 'Fair', 'Good', 'Strong'];
      return texts[this.passwordStrength - 1] || '';
    },
    strengthTextColor() {
      const colors = ['text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600'];
      return colors[this.passwordStrength - 1] || 'text-gray-400';
    },
    errors() {
      const e = {};
      if (this.touched.name) {
        if (!this.name) e.name = 'Full name is required.';
        else if (this.name.length < 2) e.name = 'Name must be at least 2 characters.';
      }
      if (this.touched.email) {
        if (!this.email) e.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(this.email)) e.email = 'Please enter a valid email address (e.g. user@company.com).';
      }
      if (this.touched.password) {
        if (!this.password) e.password = 'Password is required.';
        else if (this.password.length < 6) e.password = 'Password must be at least 6 characters.';
      }
      if (this.touched.confirmPassword) {
        if (!this.confirmPassword) e.confirmPassword = 'Please confirm your password.';
        else if (this.confirmPassword !== this.password) e.confirmPassword = 'Passwords do not match.';
      }
      if (this.touched.role) {
        if (!this.role) e.role = 'Please select a role.';
      }
      return e;
    },
    isFormValid() {
      return (
        this.name.length >= 2 &&
        EMAIL_REGEX.test(this.email) &&
        this.password.length >= 6 &&
        this.confirmPassword === this.password &&
        this.role
      );
    },
  },
  methods: {
    touchField(field) {
      this.touched = { ...this.touched, [field]: true };
    },
    fieldError(field) {
      return this.errors[field] || '';
    },
    async handleRegister() {
      this.touched = { name: true, email: true, password: true, confirmPassword: true, role: true };
      if (!this.isFormValid) return;

      this.error = '';
      this.loading = true;
      try {
        const { data } = await api.post('/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        this.$router.push(data.user.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard');
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
