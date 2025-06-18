const { body, query, param } = require('express-validator');

const validationMiddleware = require('../middleware/validationMiddleware');

const getAccountsValidator = [
    query('type')
        .notEmpty().withMessage('Type cannot be empty.')
        .isIn(['admins', 'users', 'admin', 'user']).withMessage('Type must be either "admins" or "users".'),
    query('search').optional().trim(),
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'all']).withMessage('Status must be either "active", "inactive", or "all".'),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer.')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be an integer between 1 and 100.')
        .toInt(),
    validationMiddleware
];

const createAccountValidator = [
    body('type')
        .notEmpty().withMessage('Account type is required.')
        .isIn(['admin', 'user', 'admins', 'users']).withMessage('Account type must be either "admin" or "user", "admins", or "users"' ),

    body('full_name')
        .notEmpty().withMessage('Full name is required.')
        .trim()
        .isLength({ min: 4 }).withMessage('Full name must be at least 4 characters long.'),

    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required.')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        .withMessage('Password must contain both letters and numbers.'),

    body('phone_number')
        .notEmpty().withMessage('Phone number is required.')
        .isMobilePhone('vi-VN').withMessage('Invalid phone number format (e.g., 0912345678).'),

    body('date_of_birth')
        .optional()
        .isISO8601().toDate().withMessage('Invalid date format. Use YYYY-MM-DD.'),

    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender. Only "Male", "Female", or "Other" are allowed.'),

    body('status')
        .notEmpty().withMessage('Status is required.')
        .isIn(['active', 'inactive']).withMessage('Invalid status. Only "active" or "inactive" are allowed.'),

    body('avatar_url')
        .optional()
        .custom((value) => {
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,([A-Za-z0-9+/=])+$/;

            if (value && typeof value === 'string') {
                if (urlRegex.test(value) || base64Regex.test(value)) return true;
            } else if (value === null) {
                return true;
            }
            throw new Error('Invalid avatar URL. Must be a valid URL, Base64 image string, or null.');
        }),

    body('role')
        .if(body('type').equals('admin') || body('type').equals('admins'))
        .notEmpty().withMessage('Role is required for admin accounts.')
        .isIn(['admin', 'staff']).withMessage('Invalid role. Only "admin" or "staff" are allowed.'),

    validationMiddleware
];

const updateAccountValidator = [
    body('type')
        .notEmpty().withMessage('Account type is required.')
        .isIn(['admin', 'user', 'admins', 'users']).withMessage('Account type must be either "admin" or "user".'),

    body('full_name')
        .notEmpty().withMessage('Full name is required.')
        .trim()
        .isLength({ min: 4 }).withMessage('Full name must be at least 4 characters long.'),

    body('email')
        .notEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Invalid email format.')
        .normalizeEmail(),

    body('phone_number')
        .notEmpty().withMessage('Phone number is required.')
        .isMobilePhone('vi-VN').withMessage('Invalid phone number format (e.g., 0912345678).'),

    body('date_of_birth')
        .optional()
        .isISO8601().toDate().withMessage('Invalid date format. Use YYYY-MM-DD.'),

    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender. Only "Male", "Female", or "Other" are allowed.'),

    body('status')
        .notEmpty().withMessage('Status is required.')
        .isIn(['active', 'inactive']).withMessage('Invalid status. Only "active" or "inactive" are allowed.'),

    body('avatar_url')
        .optional()
        .custom((value) => {
            const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            const base64Regex = /^data:image\/(jpeg|png|gif|bmp|webp);base64,([A-Za-z0-9+/=])+$/;

            if (value && typeof value === 'string') {
                if (urlRegex.test(value) || base64Regex.test(value)) return true;
            } else if (value === null) {
                return true;
            }
            throw new Error('Invalid avatar URL. Must be a valid URL, Base64 image string, or null.');
        }),

    body('role')
        .if(body('type').equals('admin') || body('type').equals('admins'))
        .notEmpty().withMessage('Role is required for admin accounts.')
        .isIn(['admin', 'staff']).withMessage('Invalid role. Only "admin" or "staff" are allowed.'),

    validationMiddleware
];

const getAccountByIdValidator = [
    query('type')
        .notEmpty().withMessage('Account type (type) is required.')
        .isIn(['admins', 'users', 'admin', 'user']).withMessage('Invalid account type. Must be either "admins" or "users".'),
    validationMiddleware
];

const deleteAccountValidator = [
    param('id')
        .notEmpty().withMessage('Account ID is required.'),
    body('type')
        .notEmpty().withMessage('Account type is required.')
        .isIn(['admins', 'users', 'admin', 'user']).withMessage('Invalid account type. Must be "admins", "users".'), // Added 'guides'
    body('delete_reason') // Changed to snake_case for consistency with previous discussion
        .notEmpty().withMessage('Delete reason is required.')
        .isLength({ min: 5 }).withMessage('Delete reason must be at least 5 characters long.'),
    validationMiddleware
];





module.exports = {
    getAccountsValidator,
    createAccountValidator,
    getAccountByIdValidator,
    updateAccountValidator,
    deleteAccountValidator
};