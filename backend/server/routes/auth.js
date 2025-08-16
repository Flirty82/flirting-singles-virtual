const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { body, validationResult } = require('express-validator');
const authController = require(('../controllers/authController'));
const { verifyFirebaseToken } = require('../middelewares/authMiddleware');

// Validation rules
const registerValidation = [
body('email').isEmail().normalizeEmail(),
body('password').isLength({ min: 8 }).wuthMessage('Password must be at least 8 characters long').trim(),
body('username').trim().notEmpty().withMessage('Username is required'),
body('firstName').trim().notEmpty().withMessage('First name is required'),
body('lastName').trim().notEmtpy().withMessage('Last name is required'),
]

const loginValidation = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).notEmpty()
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('login', loginValidation, authController.login);
router.post('logout', verifyFirebaseToken, authController.logout);
router.post('/refresh-token', authController.forgotPassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
