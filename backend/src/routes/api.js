const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const activityCtrl = require('../controllers/activityController');

// User Profile Sync
router.post('/user/sync', userCtrl.syncProfile);
router.get('/user/:deviceId', userCtrl.getProfile);

// Activity Sync
router.post('/activity/sync', activityCtrl.syncActivity);
router.get('/activity/:deviceId', activityCtrl.getActivities);

module.exports = router;
