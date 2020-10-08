const authenticationService = require('../../services/authenticationService');
const paymentsService = require('../../services/paymentsService');
const CustomError = require('../../classes/CustomError');
const errorCodes = CustomError.errorCodes;
const { body, validationResult } = require('express-validator')
const ValidationError = require('../../classes/ValidationError');
const validationErrorTypes = ValidationError.validationErrorTypes;

/*
 * POST /v1/authenticate route
 * Verifies username and password and returns a temporary (30m) authentication token.
 */
exports.authenticateUser = async function (req, res, next) {
    try {
        //Validates username and password are not null
        if(req.body.username == null) return next(new ValidationError(errorCodes.ERR_VALIDATION, 'username', validationErrorTypes.VALUE_IS_NULL))
        if(req.body.password == null) return next(new ValidationError(errorCodes.ERR_VALIDATION, 'password', validationErrorTypes.VALUE_IS_NULL))

        let username = req.body.username;
        let password = req.body.password;

        //Try Authenticate User
        if (!await authenticationService.authenticateUser(username, password)) return next(new CustomError(errorCodes.ERR_CANNOT_AUTHENTICATE_USER))

        //Generate temporary access token
        let accessToken = await authenticationService.generateAccessToken(username)
        res.status(200).send(accessToken)
    } catch (e) {
        next(e);
    }
}

/*
 * GET /v1/payments route
 * Returns a list of all existing payments.
 */
exports.getPayments = async function (req, res, next) {
    try {
        let payments = await paymentsService.getAllPayments();
        res.status(200).send(payments)
    } catch (e){
        next(e)
    }
}

/*
 * POST /v1/payments route
 * Creates a new payment.
 */
exports.createNewPayment = async function (req, res, next) {
    try {
        const errors = validationResult(req);
        //Check if there are any Validation Errors
        if(!errors.isEmpty()) {
            let error = errors.array()[0];
            return next(new ValidationError(errorCodes.ERR_VALIDATION, error.param, error.msg, error.value))
        }
        let payment = req.body
        //Create Payment
        payment = await paymentsService.createPayment(payment)
        res.status(201).send(payment)
    } catch (e){
        next(e);
    }
}

/*
 * GET /v1/payment/:id route
 * Retrieves a payment given its id.
 */
exports.getPayment = async function (req, res, next) {
    try {
        let { id } = req.params;
        let payment = await paymentsService.getPaymentById(id);
        res.status(200).send(payment)
    } catch (e){
        next(e);
    }
}

/*
 * PUT /v1/payments/:id/approve route
 * Approves a payment given its id.
 */
exports.approvePayment = async function (req, res, next) {
    try {
        let { id } = req.params;
        await paymentsService.approvePayment(id);
        res.sendStatus(200)
    } catch (e) {
        next(e);
    }
}

/*
 * PUT /v1/payments/:id/cancel route
 * Cancels a payment given its id.
 */
exports.cancelPayment = async function (req, res, next) {
    try {
        let { id } = req.params;
        await paymentsService.cancelPayment(id);
        res.sendStatus(200)
    } catch (e) {
        next(e);
    }
}

/*
 * Validation middleware.
 */
exports.validate = (method) => {
    switch (method) {
        case 'createNewPayment': {
            return [
                body('payeeId', validationErrorTypes.VALUE_IS_NULL).exists(),
                body('payerId', validationErrorTypes.VALUE_IS_NULL).exists(),
                body('paymentSystem', validationErrorTypes.VALUE_IS_NULL).exists(),
                body('paymentMethod', validationErrorTypes.VALUE_IS_NULL).exists(),
                body('amount', validationErrorTypes.VALUE_IS_NULL).exists(),
                body('amount', validationErrorTypes.VALUE_IS_NOT_NUMBER).isNumeric(),
                body('currency', validationErrorTypes.VALUE_IS_NULL).exists(),
            ]
        }
    }
}