/*
 * Used for hashing and comparing/verifying passwords.
 */

const bcrypt = require('bcrypt');

/*
 * Return Hash of password
 */
function hashPassword (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function(err, hash) {
            if(err) {
                reject(err)
            } else {
                resolve(hash)
            }
        });
    })
}

/*
 * Compares plaintext password and hash password to see if they match.
 */
function compare (password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash,function(err, result) {
            if(err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    })
}

module.exports = {hashPassword, compare}
