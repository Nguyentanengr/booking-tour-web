
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');


const { getPaymentValidator, getStatsValidator, createPaymentValidator, updatePaymentValidator } = require('../validators/aPaymentValidator');
const { getPayments, getStats, getPaymentById, searchBookingIds, createPayment, updatePayment, deletePayment } = require('../controllers/aPaymentController');

router.get('/', ...getPaymentValidator, getPayments);
router.get('/stats', ...getStatsValidator, getStats); // Assuming stats is also handled by the same controller
router.get('/:id', getPaymentById);
router.post('/', ...createPaymentValidator, createPayment);
router.put('/:id', ...updatePaymentValidator, updatePayment); // Assuming update is the same as create for simplicity
router.delete('/:id', deletePayment);
module.exports = router;
