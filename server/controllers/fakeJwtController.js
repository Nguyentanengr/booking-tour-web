const log4js = require('log4js');

const {successResponse, errorResponse} = require("../utils/response");
const {generateTokens} = require("../utils/jwt");

const logger = log4js.getLogger();

const fakeJwt = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const { accessToken, refreshToken } = generateTokens({ userId, role });

        // Phản hòi về client
        const responseData = {
            accessToken,
            refreshToken,
        }
        logger.info('Fake jwt token response: ', responseData)
        successResponse(res, responseData, 201);

    } catch (error) {
        logger.error('Error fake jwt token: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
}

module.exports = {
    fakeJwt
}