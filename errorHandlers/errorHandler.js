/*
 * Custom error handler middleware that is used by express
 */

const errorCodes = require('../classes/CustomError').errorCodes;

function errorHandler  (err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }

    switch (err.code) {
        case errorCodes.ERR_CANNOT_CANCEL:
            res.status(500).send(errorCodes.ERR_CANNOT_CANCEL);
            break;
        case errorCodes.ERR_CANNOT_APPROVE:
            res.status(500).send(errorCodes.ERR_CANNOT_APPROVE);
            break;
        case errorCodes.ERR_AUTH_TOKEN_EXPIRED:
            res.status(401).send(errorCodes.ERR_AUTH_TOKEN_EXPIRED);
            break;
        case errorCodes.ERR_CANNOT_AUTHENTICATE_USER:
            res.status(401).send(errorCodes.ERR_CANNOT_AUTHENTICATE_USER);
            break;
        case errorCodes.ERR_USER_NOT_FOUND:
            res.status(401).send(errorCodes.ERR_USER_NOT_FOUND);
            break;
        case errorCodes.ERR_UNAUTHORIZED:
            res.status(401).send(errorCodes.ERR_UNAUTHORIZED);
            break;
        case errorCodes.ERR_VALIDATION:
            let body = {
                code: errorCodes.ERR_VALIDATION.code,
                message: errorCodes.ERR_VALIDATION.message,
                details: [err.details]
            }
            res.status(400).send(body);
            break;
        case errorCodes.ERR_PAYMENT_NOT_FOUND:
            res.status(404).send(errorCodes.ERR_PAYMENT_NOT_FOUND)
            break;
        default:
            res.status(500).send('Something broke!');
    }
}

module.exports = errorHandler;