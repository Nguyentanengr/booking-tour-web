

const jwt = require('jsonwebtoken');

// Hàm tạo access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role || 'user',
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Access token hết hạn sau 15 phút
    );
};

// Hàm tạo refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' } // Refresh token hết hạn sau 7 ngày
    );
};

// Hàm tạo cả access token và refresh token
const generateTokens = (user) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return { accessToken, refreshToken };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateTokens,
};