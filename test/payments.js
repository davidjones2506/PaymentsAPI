process.env.NODE_ENV = 'test';
let fs = require('fs');
let path = require('path')
let paymentsJSONData = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./test-data/Payments.json')));
const PAYMENTS_FILE_PATH = path.resolve(__dirname, `../data/Payments.json`);
let dataClient = require('../clients/dataClient');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let paymentStatus = require('../constants/paymentStatus');
const errorCodes = require('../constants/errorCodes');

var token;



chai.use(chaiHttp);
//Our parent block
describe('Payments', () => {
    before((done) => {
        let login = {
            username: "serious_business",
            password: "suchPassw0rdSecure"
        }
        chai.request(server)
            .post('/v1/authenticate')
            .send(login)
            .end((err, res) => {
                token = res.text
                done()
            })
    })
    beforeEach((done) => {
        //Before each test we rewrite the same data to the data file
        dataClient.writeData(dataClient.PAYMENTS_FILE_PATH,paymentsJSONData)
            .then(() => {
                done();
            })
            .catch((err) => {
                console.error(err)
            })
    });




    /*
      * Test the /GET route
    */
    describe('/GET v1/payments', () => {
        it('it should GET all the payments', (done) => {
            chai.request(server)
                .get('/v1/payments')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });
    });



    /*
      * Test the /POST route
    */
    describe('/POST v1/payments', () => {

        it('it should POST a payment', (done) => {
            let payment =
                {
                    "payeeId": "a5b500e1-2ba7-4623-baa2-e096a721b5e",
                    "payerId": "d8f090ae-a4ed-42dc-9181-f51564d0e305",
                    "paymentSystem": "yandexMoney",
                    "paymentMethod": "PMB",
                    "amount": 5000,
                    "currency": "GBP",
                    "comment": "Bob Savings"
                }
            chai.request(server)
                .post('/v1/payments')
                .set({ "Authorization": `Bearer ${token}` })
                .send(payment)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id');
                    res.body.should.have.property('amount').eql(payment.amount);
                    res.body.should.have.property('comment').eql(payment.comment);
                    done();
                });
        });


        it('it should NOT POST a payment if amount field is missing', (done) => {
            let payment =
                {
                    "payeeId": "a5b500e1-2ba7-4623-baa2-e096a721b5e",
                    "payerId": "d8f090ae-a4ed-42dc-9181-f51564d0e305",
                    "paymentSystem": "yandexMoney",
                    "paymentMethod": "PMB",
                    "currency": "GBP",
                    "comment": "Bob Savings"
                }
            chai.request(server)
                .post('/v1/payments')
                .set({ "Authorization": `Bearer ${token}` })
                .send(payment)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('code').eql(errorCodes.ERR_VALIDATION.code);
                    res.body.should.have.property('message').eql(errorCodes.ERR_VALIDATION.message);
                    let details = res.body.details[0];
                    details.should.have.property('path').eql(["amount"])
                    done();
                });
        });

        it('it should NOT POST a payment if amount field is not numeric', (done) => {
            let payment =
                {
                    "payeeId": "a5b500e1-2ba7-4623-baa2-e096a721b5e",
                    "payerId": "d8f090ae-a4ed-42dc-9181-f51564d0e305",
                    "paymentSystem": "yandexMoney",
                    "paymentMethod": "PMB",
                    "ammount": "d123",
                    "currency": "GBP",
                    "comment": "Bob Savings"
                }
            chai.request(server)
                .post('/v1/payments')
                .set({ "Authorization": `Bearer ${token}` })
                .send(payment)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('code').eql(errorCodes.ERR_VALIDATION.code);
                    res.body.should.have.property('message').eql(errorCodes.ERR_VALIDATION.message);
                    let details = res.body.details[0];
                    details.should.have.property('path').eql(["amount"])
                    done();
                });
        });
    })


    /*
      * Test the /GET/:id  route
    */
    describe('/GET v1/payment/:id', () => {
        it('it should GET a payment by the given id', (done) => {
            let id = '84a5beba-1623-4ced-a8ec-67c0ad17e92c';
            chai.request(server)
                .get('/v1/payment/' + id)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('id').eql(id);
                    res.body.should.have.property('payeeId');
                    res.body.should.have.property('payerId');
                    res.body.should.have.property('paymentMethod');
                    res.body.should.have.property('amount');
                    res.body.should.have.property('currency');
                    res.body.should.have.property('status');
                    res.body.should.have.property('comment');
                    res.body.should.have.property('created');
                    res.body.should.have.property('updated');
                    done();
                });
        });

        it('it should NOT get a payment by the given id if it doesnt exist', (done) => {
            let id = '12345-6789-1245356-2464356-edefgdv';
            chai.request(server)
                .get('/v1/payment/' + id)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('code').eql(errorCodes.ERR_PAYMENT_NOT_FOUND.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_PAYMENT_NOT_FOUND.message)

                    done();
                });
        });

    });


    /*
      * Test the /PUT/:id/approve  route
    */
    describe('/PUT v1/payment/:id/approve', () => {

        it('it should Approve a payment by the given id', (done) => {
            let id = '9781bd16-8221-4eb6-a37f-2eb60acc1338';
            chai.request(server)
                .put('/v1/payments/' + id + '/approve')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);

                    chai.request(server) //Check to see if status of payment has changed
                        .get('/v1/payment/' + id)
                        .set({ "Authorization": `Bearer ${token}` })
                        .end((err, res) => {
                            res.body.should.have.property('status').eql(paymentStatus.APPROVED);
                            done();
                        });
                });
        });

        it('it should NOT approve a payment if its already been cancelled', (done) => {
            let id = '84a5didi-1623-4ceb-a8nc-67d0ad17e427'; //id of payment that is cancelled
            chai.request(server)
                .put('/v1/payments/' + id + '/approve')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('code').eql(errorCodes.ERR_CANNOT_APPROVE.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_CANNOT_APPROVE.message)



                    chai.request(server) //Check to see if status of payment has changed
                        .get('/v1/payment/' + id)
                        .set({ "Authorization": `Bearer ${token}` })
                        .end((err, res) => {
                            res.body.should.have.property('status').eql(paymentStatus.CANCELLED);
                            done();
                        });
                });
        });
    });



    /*
      * Test the /PUT/:id/cancel  route
    */
    describe('/PUT v1/payment/:id/cancel', () => {
        it('it should Cancel a payment by the given id', (done) => {
            let id = '9781bd16-8221-4eb6-a37f-2eb60acc1338';
            chai.request(server)
                .put('/v1/payments/' + id + '/cancel')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(200);

                    chai.request(server) //Check to see if status of payment has changed
                        .get('/v1/payment/' + id)
                        .set({ "Authorization": `Bearer ${token}` })
                        .end((err, res) => {
                            res.body.should.have.property('status').eql(paymentStatus.CANCELLED);
                            done();
                        });
                });
        });


        it('it should NOT Cancel a payment if its already been approved', (done) => {
            let id = '84a5beba-1623-4ced-a8ec-67c0ad17e92c'; //id of payment that is approved
            chai.request(server)
                .put('/v1/payments/' + id + '/cancel')
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('code').eql(errorCodes.ERR_CANNOT_CANCEL.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_CANNOT_CANCEL.message)

                    chai.request(server) //Check to see if status of payment has changed
                        .get('/v1/payment/' + id)
                        .set({ "Authorization": `Bearer ${token}` })
                        .end((err, res) => {
                            res.body.should.have.property('status').eql(paymentStatus.APPROVED);
                            done();
                        });
                });
        });
    });


    describe('TESTING AUTHENTICATION', () => {
        /*
         * Testing Authentication
         */
        it('it should NOT GET payments if token is invalid', (done) => {
            let invalid_token = 'blahblahblahblah'
            chai.request(server)
                .get('/v1/payments')
                .set({ "Authorization": `Bearer ${invalid_token}` })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('code').eql(errorCodes.ERR_UNAUTHORIZED.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_UNAUTHORIZED.message)
                    done();
                });
        });

        it('it should NOT GET payments if token has expired', (done) => {
            let expired_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjoic2VyaW91c19idXNpbmVzcyIsImlhdCI6MTYwMjAwNzU1MiwiZXhwIjoxNjAyMDA4NzUyfQ.OBJPnh4rudhQ-MRNTE0Rc9FyKwAeHgwq4TxyLLpwIbY'
            chai.request(server)
                .get('/v1/payments')
                .set({ "Authorization": `Bearer ${expired_token}` })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('code').eql(errorCodes.ERR_AUTH_TOKEN_EXPIRED.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_AUTH_TOKEN_EXPIRED.message)
                    done();
                });
        });
    })
});