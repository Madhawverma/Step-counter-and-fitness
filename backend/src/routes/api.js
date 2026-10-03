const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const activityCtrl = require('../controllers/activityController');
const stepsRoutes = require('./stepsRoutes');
const goalsRoutes = require('./goalsRoutes');
const authRoutes = require('./authRoutes');

// Auth Routes
router.use('/auth', authRoutes);

// User Profile Sync
router.post('/user/sync', userCtrl.syncProfile);
router.get('/user/:deviceId', userCtrl.getProfile);

// Activity Sync
router.post('/activity/sync', activityCtrl.syncActivity);
router.get('/activity/:deviceId', activityCtrl.getActivities);

// Steps and Goals
router.use('/steps', stepsRoutes);
router.use('/goals', goalsRoutes);

module.exports = router;
