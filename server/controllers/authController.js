// booking-tour-web - Copy/server/controllers/authController.js
const adminsModel = require('../models/AdminsModel');
const usersModel = require('../models/UsersModel');
const {
    generateTokens,
    verifyRefreshToken
} = require('../utils/jwt');
const {
    successResponse,
    errorResponse
} = require('../utils/response');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


// 1. User/Admin Login
exports.login = async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        let user = await adminsModel.findOne({
            email
        });
        let role = '';

        if (user) {
            role = user.role; // lấy đúng role từ DB (admin hoặc super_admin)
        } else {
            user = await usersModel.findOne({
                email
            });
            role = 'user';
        }

        if (!user || !await bcrypt.compare(password, user.password)) {
            return errorResponse(res, 'Email hoặc mật khẩu không chính xác.', 401);
        }

        const {
            accessToken,
            refreshToken
        } = generateTokens({
            _id: user._id,
            role
        });
        successResponse(
            res, {
                accessToken,
                refreshToken,
                user: {
                    _id: user._id,
                    name: user.fullName,
                    email: user.email,
                    role
                },
                message: "Đăng nhập thành công."
            },
            200
        );

    } catch (error) {
        errorResponse(res, 'Lỗi server: ' + error.message, 500);
    }
};


// 2. User Registration
exports.register = async (req, res) => {
    // Thêm 'gender' vào
    const {
        fullName,
        email,
        password,
        phoneNumber,
        gender
    } = req.body;
    try {
        let user = await usersModel.findOne({
            email
        });
        if (user) {
            return errorResponse(res, 'Email đã được sử dụng.', 400);
        }

        // Thêm 'gender' và 'status' khi tạo user mới
        user = new usersModel({
            fullName,
            email,
            password,
            phoneNumber,
            gender,
            status: 'active'
        });
        await user.save();

        successResponse(res, {
            user: {
                _id: user._id,
                name: user.fullName,
                email: user.email
            }
        }, 201);
    } catch (error) {
        // Thêm console.log để debug tốt hơn
        console.error('Lỗi khi đăng ký:', error);
        errorResponse(res, 'Lỗi server: ' + error.message, 500);
    }
};

// 3. Forgot Password - Step 1: Request OTP
exports.forgotPassword = async (req, res) => {
    const {
        email
    } = req.body;
    try {
        // 1. Tìm người dùng trong cả hai collection
        const user = await adminsModel.findOne({
            email
        }) || await usersModel.findOne({
            email
        });
        if (!user) {
            return errorResponse(res, 'Người dùng với email này không tồn tại.', 404);
        }

        // 2. Tạo mã OTP ngẫu nhiên và hash nó
        const resetToken = crypto.randomBytes(3).toString('hex').toUpperCase(); // Tạo OTP 6 ký tự
        user.resetPasswordToken = await bcrypt.hash(resetToken, 10); // Hash OTP trước khi lưu
        user.resetPasswordExpires = Date.now() + 600000; // Hết hạn sau 10 phút
        await user.save();

        // 3. Cấu hình và gửi email bằng Nodemailer
        // (Lưu ý: Bạn nên lưu thông tin nhạy cảm này trong file .env)
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Hoặc bất kỳ dịch vụ email nào bạn dùng
            auth: {
                user: process.env.EMAIL_USERNAME, // Email của bạn
                pass: process.env.EMAIL_PASSWORD, // Mật khẩu email hoặc mật khẩu ứng dụng
            },
        });

        const mailOptions = {
            from: `"Booking Tour" <${process.env.EMAIL_USERNAME}>`,
            to: user.email,
            subject: 'Yêu cầu đặt lại mật khẩu',
            html: `
                <p>Chào bạn ${user.fullName || ''},</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình:</p>
                <h2 style="text-align: center; letter-spacing: 2px;">${resetToken}</h2>
                <p>Mã OTP này sẽ hết hạn trong 10 phút.</p>
                <p>Nếu bạn không yêu cầu việc này, vui lòng bỏ qua email này.</p>
            `
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // 4. Trả về thông báo thành công cho người dùng
        successResponse(res, {
            message: `Một mã OTP đã được gửi đến email của bạn.`
        });

    } catch (error) {
        console.error('Lỗi trong forgotPassword:', error);
        errorResponse(res, 'Đã xảy ra lỗi khi gửi email. Vui lòng thử lại.', 500);
    }
};

// 4. Forgot Password - Step 2: Verify OTP
exports.verifyOtp = async (req, res) => {
    const {
        email,
        otp
    } = req.body;
    try {
        const user = await adminsModel.findOne({
            email,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }) || await usersModel.findOne({
            email,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user || !user.resetPasswordToken || !await bcrypt.compare(otp, user.resetPasswordToken)) {
            return errorResponse(res, 'OTP không hợp lệ hoặc đã hết hạn.', 400);
        }

        successResponse(res, {
            message: 'Xác thực OTP thành công.'
        });
    } catch (error) {
        errorResponse(res, 'Lỗi server: ' + error.message, 500);
    }
};

// 5. Forgot Password - Step 3: Reset Password
exports.resetPassword = async (req, res) => {
    const {
        email,
        otp,
        newPassword
    } = req.body;
    try {
        const user = await adminsModel.findOne({
            email,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        }) || await usersModel.findOne({
            email,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        });

        if (!user || !user.resetPasswordToken || !await bcrypt.compare(otp, user.resetPasswordToken)) {
            return errorResponse(res, 'OTP không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.', 400);
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        successResponse(res, {
            message: 'Mật khẩu đã được cập nhật thành công.'
        });
    } catch (error) {
        errorResponse(res, 'Lỗi server: ' + error.message, 500);
    }
};

// 6. Refresh Access Token
exports.refreshToken = async (req, res) => {
    const {
        refreshToken
    } = req.body;
    if (!refreshToken) return errorResponse(res, 'Refresh token không được cung cấp.', 401);

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const {
            accessToken
        } = generateTokens({
            _id: decoded._id,
            role: decoded.role
        }, 'access');
        successResponse(res, {
            accessToken
        });
    } catch (error) {
        errorResponse(res, 'Refresh token không hợp lệ hoặc đã hết hạn.', 403);
    }
};