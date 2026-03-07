<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Employee Dashboard</h1>

    <!-- Apply for Leave Form -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Apply for Leave</h2>

      <div v-if="formError" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ formError }}
      </div>
      <div v-if="formSuccess" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
        {{ formSuccess }}
      </div>

      <form @submit.prevent="submitLeave" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
          <select
            v-model="leaveForm.leaveType"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
          >
            <option value="" disabled>Select type</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="annual">Annual Leave</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            v-model="leaveForm.startDate"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            v-model="leaveForm.endDate"
            type="date"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea
            v-model="leaveForm.reason"
            required
            rows="3"
            placeholder="Provide a reason for your leave"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
          ></textarea>
        </div>

        <div class="md:col-span-2">
          <button
            type="submit"
            :disabled="submitting"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ submitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>

    <!-- My Leave Applications -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">My Leave Applications</h2>

      <div v-if="loading" class="text-center py-8 text-gray-500">Loading...</div>

      <div v-else-if="leaves.length === 0" class="text-center py-8 text-gray-400">
        No leave applications yet. Apply for your first leave above.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-600">Type</th>
              <th class="px-4 py-3 font-medium text-gray-600">Start Date</th>
              <th class="px-4 py-3 font-medium text-gray-600">End Date</th>
              <th class="px-4 py-3 font-medium text-gray-600">Reason</th>
              <th class="px-4 py-3 font-medium text-gray-600">Status</th>
              <th class="px-4 py-3 font-medium text-gray-600">Reviewed By</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="leave in leaves" :key="leave._id" class="hover:bg-gray-50">
              <td class="px-4 py-3 capitalize">{{ leave.leaveType }}</td>
              <td class="px-4 py-3">{{ formatDate(leave.startDate) }}</td>
              <td class="px-4 py-3">{{ formatDate(leave.endDate) }}</td>
              <td class="px-4 py-3 max-w-xs truncate">{{ leave.reason }}</td>
              <td class="px-4 py-3">
                <span
                  :class="statusClass(leave.status)"
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                >
                  {{ leave.status }}
                </span>
              </td>
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
      leaveForm: {
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      },
    };
  },
  mounted() {
    this.fetchLeaves();
  },
  methods: {
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
      this.formError = '';
      this.formSuccess = '';

      if (this.leaveForm.endDate < this.leaveForm.startDate) {
        this.formError = 'End date must be on or after start date.';
        return;
      }

      this.submitting = true;
      try {
        await api.post('/leaves', this.leaveForm);
        this.formSuccess = 'Leave application submitted successfully!';
        this.leaveForm = { leaveType: '', startDate: '', endDate: '', reason: '' };
        await this.fetchLeaves();
      } catch (err) {
        this.formError = err.response?.data?.message || 'Failed to submit leave application.';
      } finally {
        this.submitting = false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
    statusClass(status) {
      switch (status) {
        case 'Approved':
          return 'bg-green-100 text-green-700';
        case 'Rejected':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-yellow-100 text-yellow-700';
      }
    },
  },
};
</script>
