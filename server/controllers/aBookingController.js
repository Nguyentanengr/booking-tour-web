const log4js = require('log4js');
const { successResponse, errorResponse } = require("../utils/response");
const Booking = require('../models/BookingsModel'); // Sửa lại tên model cho đúng convention
const mongoose = require('mongoose'); // Import mongoose để dùng ObjectId

const logger = log4js.getLogger();

const searchBookingIds = async (req, res) => {
    try {
        const query = req.query.query ? req.query.query.trim() : '';
        logger.info(`Searching booking IDs for query: ${query}`);

        if (!query) {
            return successResponse(res, [], 200); // Trả về mảng rỗng nếu không có query
        }

        const pipeline = [
            {
                $match: {
                    deletedAt: null // Chỉ các booking chưa bị xóa
                }
            },
            {
                // Bước 1: Chuyển đổi ObjectId _id thành chuỗi để có thể áp dụng regex
                $addFields: {
                    _idString: { $toString: "$_id" }
                }
            },
            {
                // Bước 2: Áp dụng regex lên trường chuỗi mới tạo
                $match: {
                    _idString: { $regex: new RegExp(query, 'i') } // Tìm kiếm _idString chứa chuỗi query (case-insensitive)
                }
            },
            {
                // Bước 3: Chỉ giữ lại trường _id gốc (ObjectId)
                $project: {
                    _id: 1
                }
            },
            {
                $limit: 20 // Giới hạn số lượng kết quả trả về
            }
        ];

        const bookings = await Booking.aggregate(pipeline);

        successResponse(res, bookings, 200);

    } catch (error) {
        logger.error('Error searching booking IDs: ', error);
        errorResponse(res, 'Lỗi khi tìm kiếm Booking ID: ' + error.message, 500);
    }
};

module.exports = {
    searchBookingIds
};