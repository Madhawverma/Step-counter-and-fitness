const express = require('express');
const router = express.Router();
const goalsCtrl = require('../controllers/goalsController');

router.post('/set', goalsCtrl.setGoal);
router.get('/:deviceId', goalsCtrl.getGoal);

module.exports = router;
