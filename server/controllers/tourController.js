const log4js = require('log4js');

const {successResponse, errorResponse} = require("../utils/response");
const TourTest = require('../models/Tour');

const logger = log4js.getLogger();


const createTour = async (req, res) => {
   
}

const getTours = async (req, res) => {
}

module.exports = {
    createTour,
    getTours
}