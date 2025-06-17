
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const { getPaymentValidator, getStatsValidator } = require('../validators/aPaymentValidator');
const { getPayments, getStats, getPaymentById } = require('../controllers/aPaymentController');

router.get('/', ...getPaymentValidator, getPayments);
router.get('/stats', ...getStatsValidator, getStats); // Assuming stats is also handled by the same controller
router.get('/:id', getPaymentById);
module.exports = router;
