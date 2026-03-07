const { validationResult, body } = require('express-validator');
const Leave = require('../models/Leave');

// Validation rules for leave application
const leaveValidation = [
  body('leaveType').isIn(['sick', 'casual', 'annual', 'other']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reason').trim().notEmpty().withMessage('Reason is required'),
];

// Apply for leave (Employee only)
const applyLeave = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    // Validate that end date is not before start date
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be on or after start date.' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({
      message: 'Leave application submitted successfully',
      leave,
    });
  } catch (error) {
    next(error);
  }
};

// Get my leaves (Employee only)
const getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employee: req.user._id })
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name email');

    res.json({ leaves });
  } catch (error) {
    next(error);
  }
};

// Get all leaves (Employer only)
const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find()
      .sort({ createdAt: -1 })
      .populate('employee', 'name email')
      .populate('reviewedBy', 'name email');

    res.json({ leaves });
  } catch (error) {
    next(error);
  }
};

// Update leave status (Employer only)
const updateLeaveStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected.' });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'This leave request has already been reviewed.' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    await leave.save();

    const updatedLeave = await Leave.findById(id)
      .populate('employee', 'name email')
      .populate('reviewedBy', 'name email');

    res.json({
      message: `Leave request ${status.toLowerCase()} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus, leaveValidation };
