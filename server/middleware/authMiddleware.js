const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return errorResponse(res, 'Token nor provided', 401);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Gắn userId và role vào req.user
            if (roles.length && !roles.includes(decoded.role)) {
                return errorResponse(res, 'Unauthorized', 403);
            }
            next();
        } catch (error) {
            return errorResponse(res, 'Invalid token', 401);
        }
    };
};

module.exports = authMiddleware;