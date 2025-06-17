const successResponse = (res, data, message, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
        message, // Thêm message vào response
        data,
        error: null,
        timestamp: new Date().toISOString(),
    });
};

const errorResponse = (res, error, statusCode = 500) => {
    return res.status(statusCode).json({
        status: 'error',
        data: null,
        error,
        timestamp: new Date().toISOString(),
    });
};

module.exports = { successResponse, errorResponse };