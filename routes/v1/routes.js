const express = require('express');
const router = express.Router();
const controller = require('../../controllers/v1/controller');
const authenticationService = require('../../services/authenticationService');

router.post('/authenticate', controller.authenticateUser);

router.get('/payments', authenticationService.authenticateTokenMiddleware, controller.getPayments);

router.post('/payments', authenticationService.authenticateTokenMiddleware, controller.validate('createNewPayment'), controller.createNewPayment);

router.get('/payment/:id', authenticationService.authenticateTokenMiddleware, controller.getPayment);

router.put('/payments/:id/approve', authenticationService.authenticateTokenMiddleware, controller.approvePayment);

router.put('/payments/:id/cancel', authenticationService.authenticateTokenMiddleware, controller.cancelPayment);

module.exports = router