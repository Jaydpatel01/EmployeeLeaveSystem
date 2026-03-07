<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Welcome Back</h1>
        <p class="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Don't have an account?
        <router-link to="/register" class="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      this.error = '';
      this.loading = true;
      try {
        const { data } = await api.post('/auth/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'employer') {
          this.$router.push('/employer/dashboard');
        } else {
          this.$router.push('/employee/dashboard');
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Please try again.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
