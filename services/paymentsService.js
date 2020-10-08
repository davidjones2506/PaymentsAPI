const dataClient = require('../clients/dataClient');
const moment = require('moment');
const uuid = require('uuid');
const CustomError = require('../classes/CustomError');
const paymentStatus = require('../constants/paymentStatus');

/*
 * Gets all payments
 */
function getAllPayments() {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await dataClient.getAllPayments();
            resolve(data);
        } catch (e){
            reject(e);
        }
    })
}

/*
 * Creates a new payment and inserts it into the 'database'
 */
function createPayment(payment) {
    return new Promise(async (resolve, reject) => {
        try {
            //put id at start of payment object
            payment = {id: uuid.v4(), ...payment}
            if(!payment.comment) payment.comment = null;
            payment.status = "created"
            payment.created = moment().utc().toISOString();
            payment.updated = moment().utc().toISOString();
            await dataClient.insertPayment(payment);
            resolve(payment);
        } catch (e){
            reject(e);
        }
    })
}

/*
 * Retrieves a payment given its id.
 */
function getPaymentById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            let payment = await dataClient.getPaymentById(id);
            if(payment) {
                resolve(payment)
            } else {
                //Payment not found
                reject(new CustomError(CustomError.errorCodes.ERR_PAYMENT_NOT_FOUND))
            }
        } catch (e){
            reject(e)
        }
    })
}

/*
 * Approves a payment given its id
 * Only if the payment has not already been cancelled.
 */
function approvePayment(id) {
    return new Promise(async(resolve, reject) => {
        try {
            let payment = await dataClient.getPaymentById(id);
            if(!payment) return reject(new CustomError(CustomError.errorCodes.ERR_PAYMENT_NOT_FOUND))

            if(payment.status === paymentStatus.CANCELLED) return reject(new CustomError(CustomError.errorCodes.ERR_CANNOT_APPROVE))

            //Move money from payer account to a payee account
            payment.status = paymentStatus.APPROVED;
            //Change the last updated time of the payment
            payment.updated = moment().utc().toISOString()

            //Updates payment in the 'database'
            await dataClient.updatePayment(payment);
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}


/*
 * Cancels a payment given its id
 * Only if the payment has not already been approved.
 */
function cancelPayment(id) {
    return new Promise(async(resolve, reject) => {
        try {
            let payment = await dataClient.getPaymentById(id);
            if(!payment) return reject(new CustomError(CustomError.errorCodes.ERR_PAYMENT_NOT_FOUND))

            if(payment.status === paymentStatus.APPROVED) return reject(new CustomError(CustomError.errorCodes.ERR_CANNOT_CANCEL))

            //cancels payment
            payment.status = paymentStatus.CANCELLED;
            //Changes the last updated time of the payment
            payment.updated = moment().utc().toISOString()

            //Updates payment in the 'database'
            await dataClient.updatePayment(payment);
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}


module.exports = {getAllPayments, createPayment, getPaymentById, approvePayment, cancelPayment};