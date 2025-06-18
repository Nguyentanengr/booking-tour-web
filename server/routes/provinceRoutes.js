// routes/provinces.js
const express = require('express');
const router = express.Router();
const { getProvincesByRegion} = require('../controllers/provinceController');

router.get('/', getProvincesByRegion); 

module.exports = router;