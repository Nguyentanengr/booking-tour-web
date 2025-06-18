
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { getOverviewStats, getMonthlyRevenue, getPopularTours, getRecentBookings } = require('../controllers/aOverviewController');
const { getOverviewStatsValidator, getMonthlyRevenueValidator, getPopularToursValidator, getRecentBookingsValidator } = require('../validators/aOverviewValidator');


router.get('/stats', getOverviewStatsValidator, getOverviewStats);
router.get('/revenue', getMonthlyRevenueValidator, getMonthlyRevenue);
router.get('/popular-tours', getPopularToursValidator, getPopularTours);
router.get('/recent-bookings', getRecentBookingsValidator, getRecentBookings);

module.exports = router;
