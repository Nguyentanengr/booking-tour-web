// booking-tour-web - Copy/server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, verifyOtp, resetPassword, refreshToken } = require('../controllers/authController');
const { loginValidator, registerValidator } = require('../validators/authValidator'); //
const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post('/login', loginValidator, handleValidationErrors, login);
router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

module.exports = router;