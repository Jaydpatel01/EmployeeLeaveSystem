const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  leaveValidation,
} = require('../controllers/leaveController');

// Employee routes
router.post('/', authenticate, authorize('employee'), leaveValidation, applyLeave);
router.get('/my', authenticate, authorize('employee'), getMyLeaves);

// Employer routes
router.get('/', authenticate, authorize('employer'), getAllLeaves);
router.patch('/:id', authenticate, authorize('employer'), updateLeaveStatus);

module.exports = router;
