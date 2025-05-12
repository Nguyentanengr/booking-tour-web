const { body, query } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');

const createTourValidator = [
    body('title').notEmpty().withMessage('Title cannot be empty'),
    body('title').isLength({ max: 100 }).withMessage('Title took too long'),
    body('description').notEmpty().withMessage('Description cannot be empty'),
    body('description').isLength({ max: 255 }).withMessage('Description took too long'),
    body('services').isArray({ min: 1 }).withMessage('Services cannot be empty'),
    body('departurePoint').notEmpty().withMessage('Departure point cannot be empty'),
    body('destination').notEmpty().withMessage('Destination cannot be empty'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('price').isInt({ min: 0 }).withMessage('Price cannot be negative'),
    validationMiddleware,
];

const getTourValidator = [
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


module.exports = { createTourValidator, getTourValidator };