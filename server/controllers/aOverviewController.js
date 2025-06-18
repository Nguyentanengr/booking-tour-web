const log4js = require('log4js');
const { successResponse, errorResponse } = require("../utils/response");

const Payment = require('../models/PaymentsModel');
const Booking = require('../models/BookingsModel');
const Tour = require('../models/ToursModel');
const Departure = require('../models/DeparturesModel');
const Review = require('../models/ReviewsModel');


const mongoose = require('mongoose');
const logger = log4js.getLogger();


const getOverviewStats = async (req, res) => {
    try {
        const { timeRange = '30' } = req.query; // Default to 30 days
        let days;

        switch (timeRange) {
            case '7':
                days = 7;
                break;
            case '30':
                days = 30;
                break;
            case '90':
                days = 90;
                break;
            case '365':
                days = 365;
                break;
            default:
                // This case should ideally be caught by the validator, but as a fallback
                return errorResponse(res, {
                    code: 'INVALID_REQUEST',
                    message: 'Invalid timeRange parameter. Must be 7, 30, 90, or 365.'
                }, 400);
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        logger.info(`Fetching overview statistics for the last ${days} days.`);

        // --- 1. Tours Statistics ---
        const totalTours = await Tour.countDocuments({ deletedAt: null });
        const activeTours = await Tour.countDocuments({ isActive: true, deletedAt: null });

        // --- 2. Departures Statistics ---
        // totalDepartures: Đếm số chuyến đi từ departures trong khoảng thời gian được chọn.
        logger.info(`startDate: ${startDate}, endDate: ${endDate}`);
        const totalDepartures = await Departure.countDocuments({
            departureDate: { $gte: startDate, $lte: endDate },
            deletedAt: null
        });

        // upcomingDepartures: Đếm số chuyến đi có departureDate trong tương lai.
        const now = new Date();
        const upcomingDepartures = await Departure.countDocuments({
            departureDate: { $gt: now },
            deletedAt: null
        });

        logger.info(`upcomingDepartures: ${upcomingDepartures}, now: ${now}`);
        // --- 3. Bookings Statistics ---
        // totalBookings: Đếm số booking từ bookings trong khoảng thời gian.
        const totalBookings = await Booking.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate },
            'user.deletedAt': null // Ensure user is not deleted
        });

        // pendingBookings: Đếm số booking có trạng thái pending.
        const pendingBookings = await Booking.countDocuments({
            status: 'pending',
            'user.deletedAt': null
        });

        // --- 4. Revenue Statistics ---
        // totalRevenue: Tổng amount từ các giao dịch payment thành công trong khoảng thời gian được chọn.
        const totalRevenueResult = await Payment.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: startDate, $lte: endDate },
                    deletedAt: null // Only count payments not soft-deleted
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        // monthlyRevenue: Tổng amount từ các giao dịch payment thành công trong tháng hiện tại.
        const startOfMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        const endOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const monthlyRevenueResult = await Payment.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                    deletedAt: null
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        const monthlyRevenue = monthlyRevenueResult.length > 0 ? monthlyRevenueResult[0].total : 0;

        const responseData = {
            totalTours,
            activeTours,
            totalDepartures,
            upcomingDepartures,
            totalBookings,
            pendingBookings,
            totalRevenue,
            monthlyRevenue
        };

        logger.info('Overview statistics fetched successfully.');
        return successResponse(res, responseData, 200);

    } catch (error) {
        logger.error(`Error fetching overview statistics: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const getMonthlyRevenue = async (req, res) => {
    try {
        const { timeRange = '30' } = req.query; // Default to 30 days
        let days;

        switch (timeRange) {
            case '7':
                days = 7;
                break;
            case '30':
                days = 30;
                break;
            case '90':
                days = 90;
                break;
            case '365':
                days = 365;
                break;
            default:
                return errorResponse(res, {
                    code: 'INVALID_REQUEST',
                    message: 'Invalid timeRange parameter. Must be 7, 30, 90, or 365.'
                }, 400);
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0); // Đặt về đầu ngày để đảm bảo tính toán chính xác
        endDate.setHours(23, 59, 59, 999); // Đặt về cuối ngày

        logger.info(`Fetching monthly revenue statistics for the last ${days} days.`);

        const monthlyRevenueData = await Payment.aggregate([
            {
                $match: {
                    status: 'success',
                    createdAt: { $gte: startDate, $lte: endDate },
                    deletedAt: null // Chỉ tính các thanh toán chưa bị xóa mềm
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$amount' }
                }
            },
            {
                $sort: {
                    '_id.year': 1,
                    '_id.month': 1
                }
            },
            {
                $project: {
                    _id: 0,
                    month: '$_id.month',
                    year: '$_id.year', // Thêm năm để phân biệt giữa các năm
                    revenue: '$totalRevenue'
                }
            }
        ]);

        // Post-processing để đảm bảo tất cả các tháng trong khoảng thời gian đều có dữ liệu
        // và điền 0 cho những tháng không có doanh thu.
        const result = [];
        const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1); // Start from the first day of the start month

        while (current <= endDate) {
            const year = current.getFullYear();
            const month = current.getMonth() + 1; // Month is 0-indexed in JS, 1-indexed in MongoDB $month

            const found = monthlyRevenueData.find(item => item.year === year && item.month === month);
            result.push({
                month: `${month}`, // Format as string to match example
                year: `${year}`,
                revenue: found ? found.revenue : 0
            });

            current.setMonth(current.getMonth() + 1); // Move to next month
        }

        logger.info('Monthly revenue statistics fetched successfully.');
        return successResponse(res, result, 200);

    } catch (error) {
        logger.error(`Error fetching monthly revenue: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

const getPopularTours = async (req, res) => {
    try {
        const { timeRange = '30', limit = 5 } = req.query;
        let days;

        switch (timeRange) {
            case '7':
                days = 7;
                break;
            case '30':
                days = 30;
                break;
            case '90':
                days = 90;
                break;
            case '365':
                days = 365;
                break;
            default:
                return errorResponse(res, {
                    code: 'INVALID_REQUEST',
                    message: 'Invalid timeRange parameter. Must be 7, 30, 90, or 365.'
                }, 400);
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        logger.info(`Fetching popular tours for the last ${days} days, limit: ${limit}.`);

        const popularTours = await Tour.aggregate([
            {
                $match: {
                    deletedAt: null,
                    status: 'active'
                }
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'bookingsData'
                }
            },
            {
                $unwind: {
                    path: '$bookingsData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'payments',
                    localField: 'bookingsData._id',
                    foreignField: 'bookingId',
                    as: 'paymentsData'
                }
            },
            {
                $unwind: {
                    path: '$paymentsData',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    name: { $first: '$name' },
                    averageRating: { $first: '$averageRating' },
                    bookings: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        '$bookingsData',
                                        { $gte: ['$bookingsData.createdAt', startDate] },
                                        { $lte: ['$bookingsData.createdAt', endDate] },
                                        { $eq: ['$bookingsData.user.deletedAt', null] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    revenue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        '$paymentsData',
                                        { $eq: ['$paymentsData.status', 'success'] },
                                        { $gte: ['$paymentsData.createdAt', startDate] },
                                        { $lte: ['$paymentsData.createdAt', endDate] },
                                        { $eq: ['$paymentsData.deletedAt', null] }
                                    ]
                                },
                                '$paymentsData.amount',
                                0
                            ]
                        }
                    }
                }
            },
            {
                $sort: {
                    bookings: -1,
                    revenue: -1
                }
            },
            {
                $limit: parseInt(limit)
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    name: '$name',
                    bookings: '$bookings',
                    revenue: '$revenue',
                    rating: { $ifNull: ['$averageRating', 0] }
                }
            }
        ]);

        logger.info('Popular tours fetched successfully.');
        return successResponse(res, popularTours, 200);
    } catch (error) {
        logger.error(`Error fetching popular tours: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};


const getRecentBookings = async (req, res) => {
    try {
        const { timeRange = '30', limit = 5 } = req.query;
        let days;

        switch (timeRange) {
            case '7':
                days = 7;
                break;
            case '30':
                days = 30;
                break;
            case '90':
                days = 90;
                break;
            case '365':
                days = 365;
                break;
            default:
                return errorResponse(res, {
                    code: 'INVALID_REQUEST',
                    message: 'Invalid timeRange parameter. Must be 7, 30, 90, or 365.'
                }, 400);
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        logger.info(`Fetching recent bookings for the last ${days} days, limit: ${limit}.`);

        const recentBookings = await Booking.aggregate([
            {
                // Bước 1: Lọc các booking chưa bị xóa và trong khoảng thời gian
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    deletedAt: null // Chỉ lấy các booking chưa bị xóa mềm
                }
            },
            {
                // Bước 2: Join với Tours để lấy tên tour
                $lookup: {
                    from: 'tours',
                    localField: 'tourId',
                    foreignField: '_id',
                    as: 'tourInfo'
                }
            },
            {
                // Bước 3: Unwind tourInfo để biến mảng thành object (vì tourId là duy nhất)
                $unwind: '$tourInfo'
            },
            {
                // Bước 4: Join với Departures để lấy ngày khởi hành
                $lookup: {
                    from: 'departures',
                    localField: 'departureId',
                    foreignField: '_id',
                    as: 'departureInfo'
                }
            },
            {
                // Bước 5: Unwind departureInfo
                $unwind: '$departureInfo'
            },
            {
                // Bước 6: Join với Payments để lấy tổng số tiền thanh toán thành công
                // (Đây là cách an toàn hơn nếu total_price trong Booking có thể bị sửa đổi)
                $lookup: {
                    from: 'payments',
                    localField: '_id', // _id của booking
                    foreignField: 'bookingId',
                    as: 'paymentInfo'
                }
            },
            {
                // Bước 7: Thêm trường tính tổng số tiền thanh toán thành công
                $addFields: {
                    totalPaidAmount: {
                        $sum: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: '$paymentInfo',
                                        as: 'payment',
                                        // Chỉ tổng các payment thành công và chưa bị xóa
                                        cond: {
                                            $and: [
                                                { $eq: ['$$payment.status', 'success'] },
                                                { $eq: ['$$payment.deletedAt', null] }
                                            ]
                                        }
                                    }
                                },
                                as: 'filteredPayment',
                                in: '$$filteredPayment.amount'
                            }
                        }
                    }
                }
            },
            {
                // Bước 8: Sắp xếp theo ngày tạo booking giảm dần (mới nhất trước)
                $sort: {
                    createdAt: -1
                }
            },
            {
                // Bước 9: Giới hạn số lượng kết quả
                $limit: parseInt(limit)
            },
            {
                // Bước 10: Định hình lại output theo định dạng mong muốn
                $project: {
                    _id: 0,
                    id: '$_id',
                    customerName: '$user.name',
                    tourName: '$tourInfo.name',
                    departureDate: '$departureInfo.departureDate',
                    status: '$status',
                    // Sử dụng totalPaidAmount đã tính toán, nếu không có payment thành công, mặc định là totalPrice từ booking
                    amount: { $ifNull: ['$totalPaidAmount', '$totalPrice'] }
                }
            }
        ]);

        logger.info('Recent bookings fetched successfully.');
        return successResponse(res, recentBookings, 200);

    } catch (error) {
        logger.error(`Error fetching recent bookings: ${error.message}`, error);
        return errorResponse(res, {
            code: 'SERVER_ERROR',
            message: 'Server error: ' + error.message
        }, 500);
    }
};

module.exports = {
    getOverviewStats,
    getMonthlyRevenue,
    getPopularTours,
    getRecentBookings,
};