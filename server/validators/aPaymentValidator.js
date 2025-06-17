

const { body, query } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');

// const createTourValidator = [
//     body('title').notEmpty().withMessage('Title cannot be empty'),
//     body('title').isLength({ max: 100 }).withMessage('Title took too long'),
//     body('description').notEmpty().withMessage('Description cannot be empty'),
//     body('description').isLength({ max: 255 }).withMessage('Description took too long'),
//     body('services').isArray({ min: 1 }).withMessage('Services cannot be empty'),
//     body('departurePoint').notEmpty().withMessage('Departure point cannot be empty'),
//     body('destination').notEmpty().withMessage('Destination cannot be empty'),
//     body('price').isNumeric().withMessage('Price must be a number'),
//     body('price').isInt({ min: 0 }).withMessage('Price cannot be negative'),
//     validationMiddleware,
// ];

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


module.exports = { getPaymentValidator, getStatsValidator };