/**
 * This dataClient mimics that of a DB Client.
 * Pulls test-data from JSON files within the test-data folder.
 */
const fs = require('fs');
const path = require('path');
const USER_FILE_PATH = path.resolve(__dirname, `../data/Users.json`);
const PAYMENTS_FILE_PATH = path.resolve(__dirname, `../data/Payments.json`);
const CustomError = require('../classes/CustomError');

function readData (filename) {
    return new Promise(((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve(JSON.parse(data))
            }
        })
    }))
}


function writeData (filename, data) {
    return new Promise(async (resolve, reject) => {
        let stringifiedJson = JSON.stringify(data, null, 2)
        fs.writeFile(filename, stringifiedJson, (err, data) => {
            if(err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

/*
 Returns a user by username
 */
function getUser(username) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await readData(USER_FILE_PATH);
            for(var i=0; i<data.length; i++) {
                if(data[i].username === username) return resolve(data[i])
            }
            reject(new CustomError(CustomError.errorCodes.ERR_USER_NOT_FOUND))
        } catch (e){
            reject(e)
        }
    })
}

/*
 Get all payments data
 */
function getAllPayments() {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await readData(PAYMENTS_FILE_PATH);
            resolve(data)
        } catch (e){
            reject(e);
        }
    })
}

/*
 Insert a payment into the payments data JSON file.
 */
function insertPayment(payment){
    return new Promise(async (resolve, reject) => {
        try {
            let data = await readData(PAYMENTS_FILE_PATH);
            data.push(payment)
            await writeData(PAYMENTS_FILE_PATH, data);
            resolve();
        } catch (e){
            reject(e);
        }
    })
}

/*
 Returns a payment given it's id
 */
function getPaymentById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let paymentsData = await readData(PAYMENTS_FILE_PATH);
            for(var i=0; i<paymentsData.length; i++){
                if(paymentsData[i].id === id) {
                    return resolve(paymentsData[i]);
                }
            }
            resolve(false);
        } catch (e) {
            reject(e);
        }
    })
}

/*
 Finds and updates a payment given its id.
 */
function updatePayment(updatedPayment) {
    return new Promise(async (resolve, reject) => {
        try {
            let paymentsData = await readData(PAYMENTS_FILE_PATH);
            var foundPayment = false;
            for(var i=0; i<paymentsData.length; i++){
                if(paymentsData[i].id === updatedPayment.id) {
                    foundPayment = true;
                    paymentsData[i] = updatedPayment
                }
            }
            if(! foundPayment) return reject(new CustomError(CustomError.errorCodes.ERR_PAYMENT_NOT_FOUND))
            await writeData(PAYMENTS_FILE_PATH, paymentsData)
            resolve(true);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {getUser, getAllPayments, insertPayment, getPaymentById, updatePayment, writeData, PAYMENTS_FILE_PATH}