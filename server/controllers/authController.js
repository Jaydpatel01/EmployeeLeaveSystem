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

// Validation rules
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['employee', 'employer']).withMessage('Role must be employee or employer'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Register a new user
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
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
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
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
