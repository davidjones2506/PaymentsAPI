const errorCodes = require('../constants/errorCodes');

/**
 * CustomError Class that extends Error.
 * Used for creating custom errors that can be handled in the custom error handler.
 */
class CustomError extends Error {
    constructor(code) {
        super(code.code);
        this.code = code;
    }
}


module.exports = CustomError;
module.exports.errorCodes = errorCodes;