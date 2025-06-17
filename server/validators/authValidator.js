const { body } = require('express-validator');
const validationMiddleware = require('../middleware/validationMiddleware');

const registerValidator = [
    body('fullName').notEmpty().withMessage('Họ tên là bắt buộc'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('phoneNumber').matches(/^(0[3|5|7|8|9])+([0-9]{8})$/).withMessage('Số điện thoại không hợp lệ'),
    body('password').isLength({ min: 8 }).withMessage('Mật khẩu phải có ít nhất 8 ký tự'),
    validationMiddleware,
];

const loginValidator = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
    validationMiddleware,
];

module.exports = { registerValidator, loginValidator };