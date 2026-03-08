const jwt = require('jsonwebtoken');
const { validationResult, body } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Validation middleware
const registerValidation = async (req, res, next) => {
  await Promise.all([
    body('name').trim().notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters').run(req),
    body('email').trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail().run(req),
    body('password').notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .isLength({ max: 128 }).withMessage('Password must be under 128 characters').run(req),
    body('role').notEmpty().withMessage('Role is required')
      .isIn(['employee', 'employer']).withMessage('Role must be employee or employer').run(req),
  ]);
  next();
};

const loginValidation = async (req, res, next) => {
  await Promise.all([
    body('email').trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email address')
      .normalizeEmail().run(req),
    body('password').notEmpty().withMessage('Password is required').run(req),
  ]);
  next();
};

// Register a new user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ message: firstError, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0].msg;
      return res.status(400).json({ message: firstError, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { register, login, getProfile, registerValidation, loginValidation };
