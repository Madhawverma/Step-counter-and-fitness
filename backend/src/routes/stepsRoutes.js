const express = require('express');
const router = express.Router();
const stepsCtrl = require('../controllers/stepsController');

router.post('/sync', stepsCtrl.syncSteps);
router.get('/history/:deviceId', stepsCtrl.getHistory);

module.exports = router;
