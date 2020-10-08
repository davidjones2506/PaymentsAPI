/*
 * Used for signing and verifying JSON Web Tokens.
 */

const jwt = require('jsonwebtoken');
const fs = require('fs');
const secretToken = process.env.SECRET_TOKEN || 'secretToken';

module.exports = {
	sign: (payload) => {
		//Token signing options
		const signingOptions = {
			expiresIn: '30m'
		};

		return new Promise((resolve, reject) => {
			jwt.sign({payload}, secretToken, signingOptions, (err, token) => {
				if(err) {
					reject(err)
				} else {
					resolve(token)
				}
			});
		})
	},


	verify: (token) => {
		return new Promise((resolve, reject) => {
			jwt.verify(token, secretToken,null ,(err, token) => {
				if(err) {
					reject(err)
				} else {
					resolve(true)
				}
			})
		})
	}
};
