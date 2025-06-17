const log4js = require('log4js');
const { successResponse, errorResponse } = require("../utils/response");
const Payment = require('../models/PaymentsModel'); // Sửa lại tên model cho đúng convention
const Booking = require('../models/BookingsModel'); // Sửa lại tên model cho đúng convention
const mongoose = require('mongoose'); // Import mongoose để dùng ObjectId

const logger = log4js.getLogger();

const getPayments = async (req, res) => {
    try {
        const search = req.query.search ? req.query.search.trim() : '';
        const type = req.query.type || 'all';
        const status = req.query.status || 'all';
        const method = req.query.method || 'all';
        const year = parseInt(req.query.year);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        logger.info(`Received params for getPayments: search=${search}, type=${type}, status=${status}, method=${method}, year=${year}, page=${page}, limit=${limit}`);

        const pipeline = [
            // Stage 1: Lọc các giao dịch chưa bị xóa
            {
                $match: {
                    deletedAt: null
                }
            },
            // Stage 2: Join với collection 'bookings'
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookingId',
                    foreignField: '_id',
                    as: 'bookingInfo'
                }
            },
            // Stage 3: Giải nén mảng bookingInfo
            {
                $unwind: {
                    path: '$bookingInfo',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Stage 4: Thêm trường 'username'
            {
                $addFields: {
                    username: '$bookingInfo.user.name'
                }
            },
            // Stage 5: Lọc bổ sung
            {
                $match: {
                    ...(type !== 'all' && { type: type }),
                    ...(status !== 'all' && { status: status }),
                    ...(method !== 'all' && { paymentMethod: method }),
                    ...(year && {
                        $expr: {
                            $eq: [{ $year: "$createdAt" }, year]
                        }
                    }),
                    ...(search && {
                        $or: [
                            { transactionId: { $regex: search, $options: 'i' } },
                            { _id: { $regex: search, $options: 'i' } },
                            { 'bookingInfo.user.name': { $regex: search, $options: 'i' } }
                        ]
                    })
                }
            },
            // Stage 6: Sắp xếp
            {
                $sort: {
                    createdAt: -1
                }
            },
            // Stage 7: Phân trang
            {
                $facet: {
                    metadata: [{ $count: "totalItems" }],
                    payments: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        // Stage 8: Chọn các trường trả về (đã đúng camelCase)
                        {
                            $project: {
                                _id: 1,
                                bookingId: 1,
                                cancellationId: 1,
                                type: 1,
                                amount: 1,
                                paymentMethod: 1,
                                transactionId: 1,
                                status: 1,
                                createdAt: 1,
                                username: 1
                            }
                        }
                    ]
                }
            }
        ];

        const aggregationResult = await Payment.aggregate(pipeline);

        const payments = aggregationResult[0].payments;
        const totalItems = aggregationResult[0].metadata[0] ? aggregationResult[0].metadata[0].totalItems : 0;
        const totalPages = Math.ceil(totalItems / limit);

        const responseData = {
            payments,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                limit: limit
            }
        };

        successResponse(res, responseData, 200);

    } catch (error) {
        logger.error('Error getting payments: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
};

const getStats = async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        logger.info(`Received params for getStats: year=${year}`);

        const statsPipeline = [
            {
                $match: {
                    deletedAt: null,
                    createdAt: {
                        $gte: new Date(Date.UTC(year, 0, 1, 0, 0, 0)),
                        $lt: new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0))
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalCount: { $sum: 1 },
                    totalPaymentAmount: {
                        $sum: {
                            $cond: { if: { $eq: ["$type", "payment"] }, then: "$amount", else: 0 }
                        }
                    },
                    totalRefundAmount: {
                        $sum: {
                            $cond: { if: { $eq: ["$type", "refund"] }, then: "$amount", else: 0 }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCount: 1,
                    totalPaymentAmount: 1,
                    totalRefundAmount: 1,
                    netRevenue: { $subtract: ["$totalPaymentAmount", "$totalRefundAmount"] }
                }
            }
        ];

        const statsResult = await Payment.aggregate(statsPipeline);

        const stats = statsResult.length > 0 ? statsResult[0] : {
            totalCount: 0,
            totalPaymentAmount: 0,
            totalRefundAmount: 0,
            netRevenue: 0
        };

        successResponse(res, { stats }, 200);

    } catch (error) {
        logger.error('Error getting payment stats: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
};

const getPaymentById = async (req, res) => {
    try {
        const paymentId = req.params.id;
        logger.info(`Fetching payment details for ID: ${paymentId}`);

        // IMPORTANT: Convert string ID to ObjectId
        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            logger.warn(`Invalid Payment ID format: ${paymentId}`);
            return errorResponse(res, 'ID giao dịch không hợp lệ.', 400, 'BAD_REQUEST');
        }
        const objectPaymentId = new mongoose.Types.ObjectId(paymentId);

        const pipeline = [
            // Stage 1: Lọc theo _id của Payment (sử dụng ObjectId đã chuyển đổi)
            {
                $match: {
                    _id: objectPaymentId, // <--- SỬA Ở ĐÂY
                    deletedAt: null
                }
            },
            // ... (các stage khác giữ nguyên)
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'bookingId',
                    foreignField: '_id',
                    as: 'bookingInfo'
                }
            },
            {
                $unwind: { path: '$bookingInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $lookup: {
                    from: 'tours',
                    localField: 'bookingInfo.tourId',
                    foreignField: '_id',
                    as: 'tourInfo'
                }
            },
            {
                $unwind: { path: '$tourInfo', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 1,
                    bookingId: 1,
                    cancellationId: 1,
                    type: 1,
                    amount: 1,
                    paymentMethod: 1,
                    transactionId: 1,
                    status: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    bookingInfo: {
                        username: '$bookingInfo.user.name',
                        tourName: '$tourInfo.name',
                        totalPrice: '$bookingInfo.totalPrice'
                    },
                }
            }
        ];

        const result = await Payment.aggregate(pipeline);

        if (!result || result.length === 0) {
            logger.warn(`Payment with ID ${paymentId} not found or deleted.`);
            return errorResponse(res, 'Không tìm thấy giao dịch.', 404, 'NOT_FOUND');
        }

        const responsePayment = result[0];

        // FIX: Sửa lại điều kiện kiểm tra để làm sạch dữ liệu
        // Đảm bảo rằng bookingInfo chỉ bị gán null nếu tất cả các trường con đều không tồn tại
        if (responsePayment.bookingInfo &&
            !responsePayment.bookingInfo.username &&
            !responsePayment.bookingInfo.tourName &&
            (responsePayment.bookingInfo.totalPrice === undefined || responsePayment.bookingInfo.totalPrice === null)) {
            responsePayment.bookingInfo = null;
        }

        successResponse(res, responsePayment, 200);

    } catch (error) {
        logger.error(`Error getting payment by ID ${req.params.id}: `, error);
        errorResponse(res, error.message, 500);
    }
};

const createPayment = async (req, res) => {
    try {
        const { booking_id, type, amount, payment_method, transaction_id, status } = req.body;
        logger.info('Attempting to create a new payment:', { booking_id, type, amount, payment_method, transaction_id, status });

        // --- Bắt đầu kiểm tra sự tồn tại của Booking ID ---
        const existingBooking = await Booking.findOne({
            _id: booking_id,
            deletedAt: null // Đảm bảo booking chưa bị xóa mềm
        });

        if (!existingBooking || existingBooking.deletedAt !== null) {
            logger.warn(`Booking ID not found or already deleted: ${booking_id}`);
            return errorResponse(res, 'Booking ID not found or already deleted', 404,);
        }
        // --- Kết thúc kiểm tra sự tồn tại của Booking ID ---

        // Tạo đối tượng payment mới
        const newPayment = new Payment({
            bookingId: new mongoose.Types.ObjectId(booking_id), // Chuyển đổi sang ObjectId
            type,
            amount,
            paymentMethod: payment_method,
            transactionId: transaction_id || null, // Đảm bảo là null nếu không có
            status,
            createdAt: new Date(),
        });

        const savedPayment = await newPayment.save();
        logger.info(`Payment created successfully with ID: ${savedPayment._id}`);

        successResponse(res, savedPayment, 201);

    } catch (error) {
        logger.error('Error creating payment: ', error);
        // Middleware xử lý lỗi validation từ express-validator sẽ bắt các lỗi về định dạng
        // Các lỗi khác (như lỗi DB, lỗi logic không nằm trong validator) sẽ được bắt ở đây
        errorResponse(res, 'Error while creating payment ' + error.message, 500);
    }
};

const updatePayment = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID của payment cần cập nhật từ params
        const { booking_id, type, amount, payment_method, transaction_id, status } = req.body;

        logger.info(`Attempting to update payment with ID: ${id}`, { booking_id, type, amount, payment_method, transaction_id, status });

        // 1. Kiểm tra định dạng ID của payment
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid Payment ID format for update: ${id}`);
            return errorResponse(res, 'ID giao dịch không hợp lệ.', 400, 'INVALID_PAYMENT_ID');
        }

        const objectPaymentId = new mongoose.Types.ObjectId(id);

        // 2. Kiểm tra sự tồn tại của payment
        const existingPayment = await Payment.findOne({ _id: objectPaymentId, deletedAt: null });

        if (!existingPayment) {
            logger.warn(`Payment with ID ${id} not found or already deleted for update.`);
            return errorResponse(res, 'Không tìm thấy giao dịch hoặc đã bị xóa.', 404, 'PAYMENT_NOT_FOUND');
        }

        // 3. Kiểm tra sự tồn tại của Booking ID (nếu có thay đổi hoặc là bắt buộc)
        // Nếu booking_id được cung cấp và khác với bookingId hiện tại của payment
        if (booking_id && String(existingPayment.bookingId) !== booking_id) {
            const existingBooking = await Booking.findOne({
                _id: booking_id,
                deletedAt: null // Đảm bảo booking chưa bị xóa mềm
            });

            if (!existingBooking) {
                logger.warn(`Provided Booking ID not found or already deleted: ${booking_id}`);
                return errorResponse(res, 'Booking ID không tồn tại hoặc đã bị xóa.', 404, 'BOOKING_NOT_FOUND');
            }
        }

        // 4. Cập nhật thông tin payment
        existingPayment.bookingId = new mongoose.Types.ObjectId(booking_id || existingPayment.bookingId); // Cập nhật nếu có, nếu không thì giữ nguyên
        existingPayment.type = type || existingPayment.type;
        existingPayment.amount = amount || existingPayment.amount;
        existingPayment.paymentMethod = payment_method || existingPayment.paymentMethod;
        existingPayment.status = status || existingPayment.status;
        existingPayment.updatedAt = new Date(); // Cập nhật thời gian cập nhật

        // Xử lý transactionId: Nếu payment_method là 'cash', transactionId có thể là null
        if (payment_method === 'cash') {
            existingPayment.transactionId = null;
        } else {
            existingPayment.transactionId = transaction_id || existingPayment.transactionId;
        }

        const updatedPayment = await existingPayment.save();
        logger.info(`Payment with ID ${updatedPayment._id} updated successfully.`);

        successResponse(res, updatedPayment, 200, 'Cập nhật giao dịch thành công!');

    } catch (error) {
        logger.error(`Error updating payment with ID ${req.params.id}: `, error);
        errorResponse(res, 'Lỗi khi cập nhật giao dịch: ' + error.message, 500);
    }
};

const deletePayment = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID của payment cần xóa từ params

        logger.info(`Attempting to soft delete payment with ID: ${id}`);

        // 1. Kiểm tra định dạng ID của payment
        if (!mongoose.Types.ObjectId.isValid(id)) {
            logger.warn(`Invalid Payment ID format for deletion: ${id}`);
            return errorResponse(res, 'ID giao dịch không hợp lệ.', 400, 'INVALID_PAYMENT_ID');
        }

        const objectPaymentId = new mongoose.Types.ObjectId(id);

        // 2. Tìm và cập nhật payment
        // Chúng ta sẽ tìm payment chưa bị xóa và cập nhật deletedAt
        const result = await Payment.findOneAndUpdate(
            { _id: objectPaymentId, deletedAt: null }, // Điều kiện tìm kiếm: theo ID và chưa bị xóa
            { $set: { deletedAt: new Date(), updatedAt: new Date() } }, // Cập nhật deletedAt và updatedAt
            { new: true } // Trả về tài liệu đã được cập nhật
        );

        if (!result) {
            logger.warn(`Payment with ID ${id} not found or already deleted.`);
            return errorResponse(res, 'Không tìm thấy giao dịch hoặc đã bị xóa.', 404, 'PAYMENT_NOT_FOUND');
        }

        logger.info(`Payment with ID ${id} soft deleted successfully.`);
        successResponse(res, null, 200, 'Xóa giao dịch thành công!'); // Không trả về dữ liệu nếu chỉ là xác nhận xóa

    } catch (error) {
        logger.error(`Error soft deleting payment with ID ${req.params.id}: `, error);
        errorResponse(res, 'Lỗi khi xóa giao dịch: ' + error.message, 500);
    }
};

module.exports = {
    getPayments,
    getStats,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment
};