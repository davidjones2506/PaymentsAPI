let CustomError = require('./CustomError');
const validationErrorTypes = require('../constants/validationErrorTypes');

/**
 * ValidationError Class that extends CustomError.
 * Used for creating custom validation errors that can be handled in the custom error handler.
 */
class ValidationError extends CustomError {
    constructor(code, path, validationType, value) {
        super(code);
        this.code = code
        this.validationType = validationType;
        this.details = {
            path: [path],
            value: value
        };
        this.createClientMessage();
    }

    createClientMessage(){
        if (this.validationType === validationErrorTypes.VALUE_IS_NULL) {
            this.details.message = `'${this.details.path}' field is required`
            this.details.value = "null";
        } else if(this.validationType === validationErrorTypes.VALUE_IS_NOT_NUMBER){
            this.details.message = `'${this.details.path}' field should be a number`
        }
    }
}

module.exports = ValidationError;
module.exports.validationErrorTypes = validationErrorTypes

