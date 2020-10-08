/*
 * Middleware used by express to log all errors passed to express.
 */
function logErrors (err, req, res, next) {
    console.error(err.stack)
    next(err)
}

module.exports = logErrors;