<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">My Dashboard</h1>
      <p class="text-gray-500 mt-1">Manage your leave applications</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-gray-900">{{ totalCount }}</p>
            <p class="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-yellow-600">{{ pendingCount }}</p>
            <p class="text-xs text-gray-500">Pending</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-green-600">{{ approvedCount }}</p>
            <p class="text-xs text-gray-500">Approved</p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div>
            <p class="text-2xl font-bold text-red-600">{{ rejectedCount }}</p>
            <p class="text-xs text-gray-500">Rejected</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Apply for Leave Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-900">Apply for Leave</h2>
        <button v-if="!showForm" @click="showForm = true" class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          New Application
        </button>
        <button v-else @click="showForm = false; resetForm()" class="text-gray-500 hover:text-gray-700 text-sm font-medium cursor-pointer">Cancel</button>
      </div>

      <div v-if="showForm">
        <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
          <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>
          <span>{{ formError }}</span>
        </div>
        <div v-if="formSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
          <svg class="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          <span>{{ formSuccess }}</span>
        </div>

        <form @submit.prevent="submitLeave" class="space-y-4" novalidate>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Leave Type -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Leave Type</label>
              <select
                v-model="leaveForm.leaveType"
                :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all bg-white', formFieldError('leaveType') ? 'border-red-400' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
                @change="touchFormField('leaveType')"
              >
                <option value="" disabled>Select leave type</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="other">Other</option>
              </select>
              <p v-if="formFieldError('leaveType')" class="text-red-500 text-xs mt-1">{{ formFieldError('leaveType') }}</p>
            </div>

            <!-- Duration display -->
            <div v-if="leaveForm.startDate && leaveForm.endDate && !formFieldError('endDate')" class="flex items-end">
              <div class="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 w-full text-center">
                <span class="text-sm text-indigo-700 font-medium">{{ leaveDays }} day{{ leaveDays !== 1 ? 's' : '' }}</span>
              </div>
            </div>

            <!-- Start Date -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input
                v-model="leaveForm.startDate"
                type="date"
                :min="todayStr"
                :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all', formFieldError('startDate') ? 'border-red-400' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
                @change="touchFormField('startDate')"
              />
              <p v-if="formFieldError('startDate')" class="text-red-500 text-xs mt-1">{{ formFieldError('startDate') }}</p>
            </div>

            <!-- End Date -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input
                v-model="leaveForm.endDate"
                type="date"
                :min="leaveForm.startDate || todayStr"
                :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all', formFieldError('endDate') ? 'border-red-400' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
                @change="touchFormField('endDate')"
              />
              <p v-if="formFieldError('endDate')" class="text-red-500 text-xs mt-1">{{ formFieldError('endDate') }}</p>
            </div>
          </div>

          <!-- Reason -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Reason</label>
            <textarea
              v-model="leaveForm.reason"
              rows="3"
              placeholder="Please describe the reason for your leave..."
              :class="['w-full px-4 py-2.5 border rounded-lg outline-none transition-all resize-none', formFieldError('reason') ? 'border-red-400' : 'border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400']"
              @blur="touchFormField('reason')"
            ></textarea>
            <div class="flex justify-between items-center mt-1">
              <p v-if="formFieldError('reason')" class="text-red-500 text-xs">{{ formFieldError('reason') }}</p>
              <span v-else></span>
              <span class="text-xs text-gray-400">{{ leaveForm.reason.length }}/500</span>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              type="submit"
              :disabled="submitting"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              {{ submitting ? 'Submitting...' : 'Submit Application' }}
            </button>
            <button type="button" @click="resetForm()" class="text-gray-600 hover:text-gray-800 font-medium px-4 py-2.5 rounded-lg transition-colors cursor-pointer">
              Reset
            </button>
          </div>
        </form>
      </div>

      <div v-else class="text-center py-4 text-gray-400 text-sm">
        Click "New Application" to apply for leave.
      </div>
    </div>

    <!-- My Leave Applications -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-semibold text-gray-900">My Leave Applications</h2>
        <!-- Filter -->
        <select v-model="statusFilter" class="text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-200 bg-white cursor-pointer">
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-12">
        <svg class="animate-spin w-8 h-8 text-indigo-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        <p class="text-gray-500">Loading your leaves...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredLeaves.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        <p class="text-gray-500 font-medium">No leave applications found</p>
        <p class="text-gray-400 text-sm mt-1">{{ statusFilter !== 'all' ? 'Try changing the filter.' : 'Your submitted leave requests will appear here.' }}</p>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Duration</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Reason</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Applied On</th>
              <th class="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Reviewed By</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="leave in filteredLeaves" :key="leave._id" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 capitalize font-medium text-gray-700">
                  <span :class="leaveTypeIcon(leave.leaveType)">{{ leaveTypeEmoji(leave.leaveType) }}</span>
                  {{ leave.leaveType }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-600">
                <div>{{ formatDate(leave.startDate) }} — {{ formatDate(leave.endDate) }}</div>
                <div class="text-xs text-gray-400">{{ calcDays(leave.startDate, leave.endDate) }} day{{ calcDays(leave.startDate, leave.endDate) !== 1 ? 's' : '' }}</div>
              </td>
              <td class="px-4 py-3 max-w-xs">
                <span class="text-gray-600 line-clamp-2">{{ leave.reason }}</span>
              </td>
              <td class="px-4 py-3">
                <span :class="statusBadge(leave.status)" class="px-2.5 py-1 rounded-full text-xs font-semibold">
                  {{ leave.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDateTime(leave.createdAt) }}</td>
              <td class="px-4 py-3 text-gray-500">{{ leave.reviewedBy?.name || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'EmployeeDashboard',
  data() {
    return {
      leaves: [],
      loading: true,
      submitting: false,
      formError: '',
      formSuccess: '',
      showForm: false,
      statusFilter: 'all',
      formTouched: {},
      leaveForm: {
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      },
    };
  },
  computed: {
    todayStr() {
      return new Date().toISOString().split('T')[0];
    },
    totalCount() { return this.leaves.length; },
    pendingCount() { return this.leaves.filter(l => l.status === 'Pending').length; },
    approvedCount() { return this.leaves.filter(l => l.status === 'Approved').length; },
    rejectedCount() { return this.leaves.filter(l => l.status === 'Rejected').length; },
    filteredLeaves() {
      if (this.statusFilter === 'all') return this.leaves;
      return this.leaves.filter(l => l.status === this.statusFilter);
    },
    leaveDays() {
      return this.calcDays(this.leaveForm.startDate, this.leaveForm.endDate);
    },
    formErrors() {
      const e = {};
      if (this.formTouched.leaveType && !this.leaveForm.leaveType) e.leaveType = 'Please select a leave type.';
      if (this.formTouched.startDate && !this.leaveForm.startDate) e.startDate = 'Start date is required.';
      if (this.formTouched.endDate) {
        if (!this.leaveForm.endDate) e.endDate = 'End date is required.';
        else if (this.leaveForm.startDate && this.leaveForm.endDate < this.leaveForm.startDate) e.endDate = 'End date must be on or after start date.';
      }
      if (this.formTouched.reason) {
        if (!this.leaveForm.reason.trim()) e.reason = 'Reason is required.';
        else if (this.leaveForm.reason.length > 500) e.reason = 'Reason must be under 500 characters.';
      }
      return e;
    },
    isLeaveFormValid() {
      return (
        this.leaveForm.leaveType &&
        this.leaveForm.startDate &&
        this.leaveForm.endDate &&
        this.leaveForm.endDate >= this.leaveForm.startDate &&
        this.leaveForm.reason.trim() &&
        this.leaveForm.reason.length <= 500
      );
    },
  },
  mounted() {
    this.fetchLeaves();
  },
  methods: {
    touchFormField(field) {
      this.formTouched = { ...this.formTouched, [field]: true };
    },
    formFieldError(field) {
      return this.formErrors[field] || '';
    },
    resetForm() {
      this.leaveForm = { leaveType: '', startDate: '', endDate: '', reason: '' };
      this.formTouched = {};
      this.formError = '';
      this.formSuccess = '';
    },
    async fetchLeaves() {
      try {
        const { data } = await api.get('/leaves/my');
        this.leaves = data.leaves;
      } catch (err) {
        console.error('Failed to fetch leaves:', err);
      } finally {
        this.loading = false;
      }
    },
    async submitLeave() {
      this.formTouched = { leaveType: true, startDate: true, endDate: true, reason: true };
      if (!this.isLeaveFormValid) return;

      this.formError = '';
      this.formSuccess = '';
      this.submitting = true;
      try {
        await api.post('/leaves', this.leaveForm);
        this.formSuccess = 'Leave application submitted successfully!';
        this.resetForm();
        this.formSuccess = 'Leave application submitted successfully!';
        await this.fetchLeaves();
        setTimeout(() => { this.formSuccess = ''; this.showForm = false; }, 2000);
      } catch (err) {
        this.formError = err.response?.data?.message || 'Failed to submit leave application.';
      } finally {
        this.submitting = false;
      }
    },
    calcDays(start, end) {
      if (!start || !end) return 0;
      const diff = new Date(end) - new Date(start);
      return Math.max(1, Math.floor(diff / 86400000) + 1);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatDateTime(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    leaveTypeEmoji(type) {
      const map = { sick: '🤒', casual: '☕', annual: '🏖️', other: '📋' };
      return map[type] || '📋';
    },
    leaveTypeIcon() { return ''; },
    statusBadge(status) {
      switch (status) {
        case 'Approved': return 'bg-green-100 text-green-700';
        case 'Rejected': return 'bg-red-100 text-red-700';
        default: return 'bg-yellow-100 text-yellow-700';
      }
    },
  },
};
</script>
