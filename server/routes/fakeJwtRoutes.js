const express = require('express');
const {fakeJwt} = require("../controllers/fakeJwtController");
const router = express.Router();

router.post('/' ,fakeJwt);

module.exports = router;