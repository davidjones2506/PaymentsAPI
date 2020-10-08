#!/usr/bin/env node
const jwt = require('../utilities/jwt');
const dataClient = require('../clients/dataClient');
const bcrypt = require('../utilities/bcrypt.js');
const CustomError = require('../classes/CustomError');

/*
 * Authenticate user using username and password provided.
 */
function authenticateUser(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await dataClient.getUser(username)
            //Check if plaintext password and stored hash password match.
            let passwordsMatch = await bcrypt.compare(password, user.hash_password)
            if(passwordsMatch) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e){
            reject(e);
        }
    })
}


async function generateAccessToken(username) {
    try {
        return await jwt.sign(username);
    } catch (e) {
        return e
    }
}

/*
 * Authentication Middleware used by some routes that need Bearer Token verification.
 */
async function authenticateTokenMiddleware(req, res, next){
    try {
        if(req.token == null) return next(new CustomError(CustomError.errorCodes.ERR_UNAUTHORIZED));

        //If can verify token then continue to route
        if (await jwt.verify(req.token)) return next();

    } catch (e){
        if(e.name === 'TokenExpiredError') {
            next(new CustomError(CustomError.errorCodes.ERR_AUTH_TOKEN_EXPIRED))
        } else {
           next(new CustomError(CustomError.errorCodes.ERR_UNAUTHORIZED));
        }
    }
}

module.exports ={ authenticateTokenMiddleware, generateAccessToken, authenticateUser };