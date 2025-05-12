const successResponse = (res, data, statusCode = 200) => {
    return res.status(statusCode).json({
        status: 'success',
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