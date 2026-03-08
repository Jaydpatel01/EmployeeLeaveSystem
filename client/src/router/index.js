import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import EmployeeDashboard from '../views/EmployeeDashboard.vue';
import EmployerDashboard from '../views/EmployerDashboard.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
  {
    path: '/employee/dashboard',
    name: 'EmployeeDashboard',
    component: EmployeeDashboard,
    meta: { requiresAuth: true, role: 'employee' },
  },
  {
    path: '/employer/dashboard',
    name: 'EmployerDashboard',
    component: EmployerDashboard,
    meta: { requiresAuth: true, role: 'employer' },
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guards
router.beforeEach((to, from) => {
  const token = localStorage.getItem('token');
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Protected routes — redirect to login if not authenticated
  if (to.meta.requiresAuth) {
    if (!token || !user) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }
    // Role mismatch — redirect to correct dashboard
    if (to.meta.role && user.role !== to.meta.role) {
      return user.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard';
    }
  }

  // Guest-only routes — redirect authenticated users to their dashboard
  if (to.meta.guest && token && user) {
    return user.role === 'employer' ? '/employer/dashboard' : '/employee/dashboard';
  }
});

export default router;
