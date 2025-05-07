const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/EarningController');
const authenticate = require('../middleware/auth');


router.use(authenticate);

// Get earnings summary (weekly, monthly, yearly)
router.get('/summary', earningsController.getEarningsSummary);

// Create earnings record for a completed delivery
router.post('/record', earningsController.createEarningsRecord);

module.exports = router;
