const log4js = require('log4js');

const {successResponse, errorResponse} = require("../utils/response");
const Tour = require('../models/Tour');

const logger = log4js.getLogger();


const createTour = async (req, res) => {
    try {
        const newTour = new Tour(req.body);
        logger.info('Received new tour from request: ', newTour)
        const savedTour = await newTour.save();

        successResponse(res, savedTour, 201);
    } catch (error) {
        logger.error('Error creating new tour: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
}

const getTours = async (req, res) => {

    try {
        const key = req.query.key ? req.query.key.trim() : '';
        const from = req.query.from ? req.query.from.trim() : '';
        const to = req.query.to ? req.query.to.trim() : '';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        logger.info('Received data from request: ', key, from, to, page, limit, '')

        // Xây dựng query tìm kiếm
        const query = { deletedAt: null }; // Lấy về các tour chưa bị xóa
        if (key) {
            query.title = { $regex: key, $options: 'i' }; // không phân biệt hoa thường
        }
        if (from) {
            query.departurePoint = from;
        }
        if (to) {
            query.destination = to;
        }

        // Thực hiện truy vấn
        const total = await Tour.countDocuments(query);
        const tours = await Tour.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .select("title description services departurePoint destination price createdAt")
            .lean(); // Trả về Tour (dữ liệu) ko có chức năng đối tượng -> tối ưu

        const responseData = {
            tours,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
        }
        successResponse(res, responseData, 200);
    } catch (error) {
        logger.error('Error getting tours: ', error);
        errorResponse(res, 'Uncategorized error: ' + error.message, 500);
    }
}

module.exports = {
    createTour,
    getTours
}