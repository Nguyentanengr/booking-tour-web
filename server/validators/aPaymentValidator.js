

const { body, query, param } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');

const createPaymentValidator = [
    // booking_id: Bắt buộc, phải là ObjectId hợp lệ, và phải tồn tại trong DB
    body('booking_id')
        .notEmpty().withMessage('Booking Id cannot be empty.')
        .isMongoId().withMessage('Booking Id is invalid.'),

    // type: Bắt buộc, chỉ được là 'payment' hoặc 'refund'
    body('type')
        .notEmpty().withMessage('Type cannot be empty.')
        .isIn(['payment', 'refund']).withMessage('Type must be either "payment" or "refund".'),

    // amount: Bắt buộc, phải là số, tối thiểu 1000
    body('amount')
        .notEmpty().withMessage('Amount cannot be empty.')
        .isNumeric().withMessage('Amount must be a number.')
        .toFloat() // Chuyển đổi sang số float
        .isInt({ min: 1000 }).withMessage('Amount must be at least 1000.'),

    // payment_method: Bắt buộc, chỉ được là một trong các phương thức đã định nghĩa
    body('payment_method')
        .notEmpty().withMessage('Payment method cannot be empty.')
        .isIn(['bank_transfer', 'credit_card', 'e_wallet', 'cash']).withMessage('Payment method must be one of: bank_transfer, credit_card, e_wallet, cash.'),

    // status: Bắt buộc, chỉ được là 'success' hoặc 'failed'
    body('status')
        .notEmpty().withMessage('Status cannot be empty.')
        .isIn(['success', 'failed']).withMessage('Status must be either "success" or "failed".'),

    validationMiddleware,
];

const updatePaymentValidator = [
    // Validate ID từ params
    param('id')
        .notEmpty().withMessage('Payment ID cannot be empty.')
        .isMongoId().withMessage('Payment ID is invalid.'),

    // Các trường khác đều là optional
    body('booking_id')
        .optional()
        .isMongoId().withMessage('Booking ID is invalid.'),
    body('type')
        .optional()
        .isIn(['payment', 'refund']).withMessage('Type must be either "payment" or "refund".'),
    body('amount')
        .optional()
        .isNumeric().withMessage('Amount must be a number.')
        .toFloat()
        .isInt({ min: 1000 }).withMessage('Amount must be at least 1000.'),
    body('payment_method')
        .optional()
        .isIn(['bank_transfer', 'credit_card', 'e_wallet', 'cash']).withMessage('Payment method must be one of: bank_transfer, credit_card, e_wallet, cash.'),
    body('status')
        .optional()
        .isIn(['success', 'failed']).withMessage('Status must be either "success" or "failed".'),
    validationMiddleware,
];

const getPaymentValidator = [
    query('type')
        .optional()
        .isIn(['all', 'payment', 'refund'])
        .withMessage('Type must be one of: all, payment, refund'),
    query('status')
        .optional()
        .isIn(['all', 'success', 'failed'])
        .withMessage('Status must be one of: all, success, failed'),
    query('method') 
        .optional()
        .isIn(['bank_transfer', 'credit_card', 'e_wallet', 'cash', 'all'])
        .withMessage('Method must be one of: bank_transfer, credit_card, e_wallet, cash, or all'),
    query('year') 
        .optional()
        .isInt({ min: 2000, max: new Date().getFullYear() })
        .withMessage('Year must be a valid year between 2000 and the current year'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer greater than 0'),
    query('limit')
        .optional() // không có thì ko cần kiểm tra
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be a positive integer between 1 and 100'),
    validationMiddleware,
];



const getStatsValidator = [ // statistics payment
    query('year') 
        .optional()
        .isInt({ min: 2000, max: new Date().getFullYear() })
        .withMessage('Year must be a valid year between 2000 and the current year'),
    validationMiddleware,
];


module.exports = { 
    getPaymentValidator, 
    getStatsValidator,
    createPaymentValidator,
    updatePaymentValidator,
 };