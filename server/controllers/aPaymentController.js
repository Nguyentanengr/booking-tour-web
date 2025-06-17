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

module.exports = {
    getPayments,
    getStats,
    getPaymentById
};