const express = require('express');
const router = express.Router();
const time = require('../controllers/app');

router.get('/', time);

module.exports = router;
