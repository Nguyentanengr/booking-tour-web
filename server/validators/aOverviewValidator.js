

const { body, query, param } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');

const getOverviewStatsValidator = [
    query('timeRange')
        .optional()
        .isIn(['7', '30', '90', '365'])
        .withMessage('Invalid timeRange. Must be 7, 30, 90, or 365.')
        .toInt(), // Chuyển đổi sang số nguyên
    validationMiddleware
];

const getMonthlyRevenueValidator = getOverviewStatsValidator;

const getPopularToursValidator = [
    query('timeRange')
        .optional()
        .isIn(['7', '30', '90', '365'])
        .withMessage('Invalid timeRange. Must be 7, 30, 90, or 365.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 20 }) // Giới hạn số lượng tour, ví dụ từ 1 đến 20
        .withMessage('Limit must be an integer between 1 and 20.')
        .toInt(),
    validationMiddleware
];

const getRecentBookingsValidator = [
    query('timeRange')
        .optional()
        .isIn(['7', '30', '90', '365'])
        .withMessage('Invalid timeRange. Must be 7, 30, 90, or 365.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 50 }) // Giới hạn số lượng booking, ví dụ từ 1 đến 50
        .withMessage('Limit must be an integer between 1 and 50.')
        .toInt(),
    validationMiddleware
];

module.exports = { 
    getOverviewStatsValidator,
    getMonthlyRevenueValidator,
    getPopularToursValidator,
    getRecentBookingsValidator,
 };