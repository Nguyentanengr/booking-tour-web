
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getTourStats, getTours, toggleTourStatus, deleteTour, getTourDetails, addTour } = require('../controllers/aTourController');
const { toggleTourStatusValidator, getToursValidator, deleteTourValidator, addTourValidator } = require('../validators/aTourValidator');


router.get('/stats', getTourStats);
router.get('/', getToursValidator, getTours);
router.patch('/:id/toggle-status', toggleTourStatusValidator, toggleTourStatus);
router.delete('/:id', deleteTourValidator, deleteTour);
router.get('/:id', getTourDetails);
router.post('/', addTourValidator, addTour);

module.exports = router;
