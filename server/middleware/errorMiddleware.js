const { errorResponse } = require('../utils/response');


// Khi có bất kì Error/ Exception nào xảy ra trong ứng dụng
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Server error';

    errorResponse(res, message, statusCode);
};

module.exports = errorMiddleware;