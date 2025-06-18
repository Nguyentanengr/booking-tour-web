const log4js = require('log4js');
const bcrypt = require('bcrypt'); // Đảm bảo bạn đã cài 'bcrypt'
const { successResponse, errorResponse } = require("../utils/response");
const Admin = require('../models/AdminsModel'); // Hoặc '../models/Admin' nếu bạn đổi tên file
const User = require('../models/UsersModel');   // Hoặc '../models/User' nếu bạn đổi tên file
const mongoose = require('mongoose');
const { uploadImageFromBase64 } = require('../utils/upload'); // Đảm bảo đường dẫn và hàm này tồn tại

const logger = log4js.getLogger();

const getModelByType = (type) => {
    if (type === 'admins' || type === 'admin') return Admin;
    if (type === 'users' || type === 'user') return User; // Đã sửa lỗi logic
    return null; 
};

const getAccounts = async (req, res) => {
    try {
        const { type, search, status, page = 1, limit = 10 } = req.query;
        const Model = getModelByType(type);

        if (!Model) {
            logger.warn(`Invalid account type received: ${type}`);
            return errorResponse(res, {
                code: 'INVALID_TYPE',
                message: 'Invalid account type. Must be either "admins" or "users".'
            }, 400);
        }

        // Sửa lỗi đánh máy trong chuỗi log
        logger.info(`Fetching ${type} accounts with search=${search}, status=${status}, page=${page}, limit=${limit}`);

        const query = { deletedAt: null }; // Chỉ lấy các tài khoản chưa bị xóa

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
            query.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { phoneNumber: searchRegex }
            ];
        }

        const totalItems = await Model.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limit);

        const accounts = await Model.find(query)
            .select('-password -__v') // Không trả về password và __v
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất

        // Giữ nguyên camelCase cho các trường trong response
        const formattedAccounts = accounts.map(account => ({
            _id: account._id,
            fullName: account.fullName,
            phoneNumber: account.phoneNumber,
            email: account.email,
            avatarUrl: account.avatarUrl,
            dateOfBirth: account.dateOfBirth ? account.dateOfBirth.toISOString().split('T')[0] : null,
            gender: account.gender,
            role: account.role || undefined, // Chỉ có ở admin, nếu không thì undefined
            status: account.status,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt ? account.updatedAt.toISOString() : undefined,
        }));

        successResponse(res, {
            accounts: formattedAccounts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit
            }
        });

    } catch (error) {
        logger.error(`Error getting accounts for type ${req.query.type}:`, error);
        errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

const createAccount = async (req, res) => {
    try {
        const {
            type,
            full_name: fullName, // Destructure và đổi tên từ snake_case sang camelCase cho biến nội bộ
            email,
            password,
            phone_number: phoneNumber, // Destructure và đổi tên
            date_of_birth: dateOfBirth, // Destructure và đổi tên
            gender,
            status,
            avatar_url: avatarUrl, // Destructure và đổi tên
            role
        } = req.body;

        const Model = getModelByType(type);
        if (!Model) {
            return errorResponse(res, {
                code: 'INVALID_TYPE',
                message: 'Invalid account type.'
            }, 400);
        }

        logger.info(`Creating ${type} account: ${email}`);

        const emailExists = await Model.findOne({ email, deletedAt: null });
        if (emailExists) {
            return errorResponse(res, {
                code: 'CONFLICT',
                message: 'Email is already in use.'
            }, 409);
        }

        const phoneExists = await Model.findOne({ phoneNumber, deletedAt: null });
        if (phoneExists) {
            return errorResponse(res, {
                code: 'CONFLICT',
                message: 'Phone number is already in use.'
            }, 409);
        }

        let finalAvatarUrl = avatarUrl;
        if (avatarUrl?.startsWith('data:image')) {
            finalAvatarUrl = await uploadImageFromBase64(avatarUrl);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const accountData = {
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            dateOfBirth,
            gender,
            status,
            avatarUrl: finalAvatarUrl || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        // Gán role nếu là Admin.
        // Đảm bảo type trong request body là "admin" (số ít) nếu bạn muốn dùng điều kiện này
        // Hoặc sử dụng `if (Model === Admin)` để linh hoạt hơn với "admins"
        if (type === 'admin' || type === 'admins') { 
            accountData.role = role;
        }

        const newAccount = new Model(accountData);
        const saved = await newAccount.save();
        const { password: _, __v, ...publicAccount } = saved.toObject();

        // Format cho client - GIỮ NGUYÊN CAMELCASE
        const response = {
            _id: publicAccount._id,
            fullName: publicAccount.fullName,
            phoneNumber: publicAccount.phoneNumber,
            email: publicAccount.email,
            avatarUrl: publicAccount.avatarUrl,
            dateOfBirth: publicAccount.dateOfBirth?.toISOString().split('T')[0] || null,
            gender: publicAccount.gender,
            role: publicAccount.role,
            status: publicAccount.status,
            createdAt: publicAccount.createdAt.toISOString(),
            updatedAt: publicAccount.updatedAt?.toISOString()
        };

        logger.info(`Account created: ${email}`);
        return successResponse(res, response, 201, 'Account created successfully.');
    } catch (error) {
        logger.error(`Account creation error: ${error.message}`);

        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            const value = error.keyValue[field];
            return errorResponse(res, {
                code: 'CONFLICT',
                message: `${field === 'email' ? 'Email' : 'Phone number'} "${value}" already exists.`
            }, 409);
        }

        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const getAccountById = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query;

        const Model = getModelByType(type);
        if (!Model) {
            return errorResponse(res, {
                code: 'INVALID_TYPE',
                message: 'Invalid account type. Must be either "admins" or "users".'
            }, 400);
        }

        logger.info(`Fetching ${type} account with ID: ${id}`);

        // Tìm tài khoản theo ID và đảm bảo nó chưa bị xóa mềm
        const account = await Model.findOne({ _id: id, deletedAt: null }).select('-password -__v');

        if (!account) {
            logger.warn(`Account not found for ID: ${id} and type: ${type}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'User not found or has been deleted.'
            }, 404);
        }

        // Format response về camelCase
        const formattedAccount = {
            _id: account._id,
            fullName: account.fullName,
            phoneNumber: account.phoneNumber,
            email: account.email,
            avatarUrl: account.avatarUrl,
            // Đảm bảo định dạng YYYY-MM-DD
            dateOfBirth: account.dateOfBirth ? account.dateOfBirth.toISOString().split('T')[0] : null,
            gender: account.gender,
            // Role chỉ xuất hiện nếu đây là tài khoản Admin
            role: account.role || undefined, 
            status: account.status,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt ? account.updatedAt.toISOString() : undefined,
        };

        logger.info(`Account fetched successfully for ID: ${id}`);
        return successResponse(res, formattedAccount, 200);

    } catch (error) {
        logger.error(`Error fetching account with ID ${req.params.id} and type ${req.query.type}:`, error);
        // Bắt lỗi khi ID không đúng định dạng ObjectId, nếu validator chưa bắt được
        if (error instanceof mongoose.Error.CastError) {
            return errorResponse(res, {
                code: 'INVALID_REQUEST',
                message: 'ID tài khoản không hợp lệ.'
            }, 400);
        }
        errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error' + error.message
        }, 500);
    }
};

const updateAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            type,
            full_name: fullName,    // Destructure from snake_case to camelCase
            email,
            phone_number: phoneNumber, // Destructure from snake_case to camelCase
            date_of_birth: dateOfBirth, // Destructure from snake_case to camelCase
            gender,
            status,
            avatar_url: avatarUrl,   // Destructure from snake_case to camelCase
            role
        } = req.body;

        const Model = getModelByType(type);
        if (!Model) {
            return errorResponse(res, {
                code: 'INVALID_TYPE',
                message: 'Invalid account type. Must be "admins" or "users".'
            }, 400);
        }

        logger.info(`Attempting to update ${type} account with ID: ${id}`);

        const account = await Model.findOne({ _id: id, deletedAt: null });

        if (!account) {
            logger.warn(`Account not found for update, ID: ${id}, type: ${type}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'Account not found or has been deleted.'
            }, 404);
        }

        // Cập nhật các trường được cung cấp
        // Sử dụng `!== undefined` để kiểm tra sự tồn tại của trường trong request body,
        // cho phép giá trị `null` được truyền để xóa dữ liệu.
        if (fullName !== undefined) account.fullName = fullName;
        if (gender !== undefined) account.gender = gender;
        if (status !== undefined) account.status = status;

        if (dateOfBirth !== undefined) {
            // dateOfBirth có thể là null để xóa
            account.dateOfBirth = dateOfBirth === null ? null : new Date(dateOfBirth);
        }

        // Xử lý avatar URL: base64 -> upload, URL -> giữ nguyên, null -> xóa
        if (avatarUrl !== undefined) {
            if (avatarUrl?.startsWith('data:image')) {
                account.avatarUrl = await uploadImageFromBase64(avatarUrl, 'avatars'); // Specify uploadDir
            } else if (avatarUrl === null) {
                account.avatarUrl = null; // Clear avatar
            } else {
                account.avatarUrl = avatarUrl; // Assume it's a valid URL
            }
        }

        // Kiểm tra xung đột email nếu email được cập nhật
        // (Kiểm tra email mới không trùng với email của tài khoản khác)
        if (email !== undefined && email !== account.email) {
            const emailExists = await Model.findOne({ email, _id: { $ne: id }, deletedAt: null });
            if (emailExists) {
                return errorResponse(res, {
                    code: 'CONFLICT',
                    message: 'Email is already in use by another account.'
                }, 409);
            }
            account.email = email;
        }

        // Kiểm tra xung đột số điện thoại nếu số điện thoại được cập nhật
        // (Kiểm tra số điện thoại mới không trùng với số điện thoại của tài khoản khác)
        if (phoneNumber !== undefined && phoneNumber !== account.phoneNumber) {
            const phoneExists = await Model.findOne({ phoneNumber, _id: { $ne: id }, deletedAt: null });
            if (phoneExists) {
                return errorResponse(res, {
                    code: 'CONFLICT',
                    message: 'Phone number is already in use by another account.'
                }, 409);
            }
            account.phoneNumber = phoneNumber;
        }

        // Cập nhật role chỉ áp dụng cho model Admin
        if (Model === Admin && role !== undefined) {
            account.role = role;
        }

        // Đảm bảo updatedAt được cập nhật thủ công (hoặc schema của bạn có timestamps: true)
        account.updatedAt = new Date();

        const updatedAccount = await account.save();
        // Loại bỏ password và __v trước khi gửi phản hồi
        const { password: _, __v, ...publicAccount } = updatedAccount.toObject();

        // Format response về camelCase
        const response = {
            _id: publicAccount._id,
            fullName: publicAccount.fullName,
            phoneNumber: publicAccount.phoneNumber,
            email: publicAccount.email,
            avatarUrl: publicAccount.avatarUrl,
            dateOfBirth: publicAccount.dateOfBirth ? publicAccount.dateOfBirth.toISOString().split('T')[0] : null,
            gender: publicAccount.gender,
            role: publicAccount.role,
            status: publicAccount.status,
            createdAt: publicAccount.createdAt.toISOString(),
            updatedAt: publicAccount.updatedAt?.toISOString()
        };

        logger.info(`Account updated successfully for ID: ${id}`);
        return successResponse(res, response, 200, 'Account updated successfully.');

    } catch (error) {
        logger.error(`Error updating account with ID ${req.params.id}:`, error);
        if (error instanceof mongoose.Error.CastError) {
            return errorResponse(res, {
                code: 'INVALID_REQUEST',
                message: 'Invalid account ID format.'
            }, 400);
        }
        errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, delete_reason: deleteReason } = req.body; // Destructure snake_case to camelCase

        const Model = getModelByType(type);
        if (!Model) {
            return errorResponse(res, {
                code: 'INVALID_TYPE',
                message: 'Invalid account type. Must be "admins" or "users"'
            }, 400);
        }

        logger.info(`Attempting to soft delete ${type} account with ID: ${id}`);

        // Find the account, ensure it's not already deleted
        const account = await Model.findOne({ _id: id, deletedAt: null });

        if (!account) {
            logger.warn(`Account not found for deletion, ID: ${id}, type: ${type}`);
            return errorResponse(res, {
                code: 'NOT_FOUND',
                message: 'Account not found or already deleted.'
            }, 404);
        }

        // Perform soft delete using updateOne to avoid validation
        const updateResult = await Model.updateOne(
            { _id: id, deletedAt: null },
            {
                $set: {
                    status: 'deleted',
                    deletedAt: new Date(),
                    deleteReason,
                    updatedAt: new Date(),
                },
            }
        );

        if (updateResult.modifiedCount === 0) {
            logger.warn(`No account was updated for ID: ${id}, type: ${type}`);
            return errorResponse(res, {
                code: 'NOT_MODIFIED',
                message: 'Failed to delete account.'
            }, 400);
        }

        logger.info(`Account soft deleted successfully for ID: ${id}`);
        return successResponse(res, { message: 'Account deleted successfully.' }, 200);

    } catch (error) {
        logger.error(`Error soft deleting account with ID ${req.params.id} and type ${req.body.type}:`, error);
        if (error instanceof mongoose.Error.CastError) {
            return errorResponse(res, {
                code: 'INVALID_REQUEST',
                message: 'Invalid account ID format.'
            }, 400);
        }
        errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};



module.exports = {
    getAccounts,
    createAccount,
    getAccountById,
    updateAccount,
    deleteAccount
};