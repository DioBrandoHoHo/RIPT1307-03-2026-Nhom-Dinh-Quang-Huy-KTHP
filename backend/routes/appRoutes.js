const express = require('express');
const router = express.Router();
const appController = require('../controllers/appController');

router.post('/register', appController.register);
router.post('/auth/register', appController.register);
router.post('/login', appController.login);
router.post('/auth/login', appController.login);

router.get('/devices', appController.getDevices);
router.post('/devices', appController.addDevice);
router.put('/devices/:id', appController.updateDevice);
router.delete('/devices/:id', appController.deleteDevice);

router.post('/orders', appController.createOrder);
router.get('/orders', appController.getOrders);
router.get('/orders/:username', appController.getOrdersByUsername);
router.put('/orders/:id', appController.updateOrderStatus);

router.get('/analytics/leaderboard', appController.getLeaderboard);

module.exports = router;