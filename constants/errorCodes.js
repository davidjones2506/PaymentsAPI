const errorCodes = {
    ERR_CANNOT_APPROVE: {
        code: "ERR_CANNOT_APPROVE",
        message: "Cannot approve a payment that has already been cancelled"
    },
    ERR_CANNOT_CANCEL: {
        code: "ERR_CANNOT_CANCEL",
        message: "Cannot cancel a payment that has already been approved"
    },
    ERR_UNAUTHORIZED: {
        code: "ERR_UNAUTHORIZED",
        message: "No Auth token provided"
    },
    ERR_CANNOT_AUTHENTICATE_USER: {
        code: "ERR_CANNOT_AUTHENTICATE_USER",
        message:"Cannot authenticate user"
    },
    ERR_USER_NOT_FOUND: {
        code: "ERR_USER_NOT_FOUND",
        message: "User not found"
    },
    ERR_AUTH_TOKEN_EXPIRED: {
        code: "ERR_AUTH_TOKEN_EXPIRED",
        message: "Auth token expired"
    },
    ERR_VALIDATION: {
        code: "ERR_VALIDATION",
        message: "Validation failed"
    },
    INTERNAL_ERROR: {
        code: "INTERNAL_ERROR",
        message: "Internal Error"
    },
    ERR_PAYMENT_NOT_FOUND:{
        code: "ERR_PAYMENT_NOT_FOUND",
        message: "Payment not found"
    }
};

module.exports = errorCodes