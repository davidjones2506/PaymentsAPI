process.env.NODE_ENV = 'test';
let dataClient = require('../clients/dataClient');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const errorCodes = require('../constants/errorCodes');

var token;



chai.use(chaiHttp);
//Our parent block
describe('Authenticate', () => {
    /*
      * Test the /POST route
    */
    describe('/POST v1/authenticate', () => {

        it('it should return a token if login is valid', (done) => {
            let login = {
                username: "serious_business",
                password: "suchPassw0rdSecure"
            }
            chai.request(server)
                .post('/v1/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(200);
                    console.log(res.text)
                    done()
                })
        });

        it('it should return a ERR_CANNOT_AUTHENTICATE_USER if username and password are wrong', (done) => {
            let login = {
                username: "serious_business",
                password: "davidIsCool"
            }
            chai.request(server)
                .post('/v1/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('code').eql(errorCodes.ERR_CANNOT_AUTHENTICATE_USER.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_CANNOT_AUTHENTICATE_USER.message)
                    done()
                })
        });

        it('it should return a ERR_USER_NOT_FOUND if username does not exist', (done) => {
            let login = {
                username: "CristianoRonaldo",
                password: "davidIsCool"
            }
            chai.request(server)
                .post('/v1/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('code').eql(errorCodes.ERR_USER_NOT_FOUND.code)
                    res.body.should.have.property('message').eql(errorCodes.ERR_USER_NOT_FOUND.message)
                    done()
                })
        });

        it('it should NOT POST a payment if username or password field is missing', (done) => {
            let login = {
                username: "CristianoRonaldo",
            }
            chai.request(server)
                .post('/v1/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('code').eql(errorCodes.ERR_VALIDATION.code);
                    res.body.should.have.property('message').eql(errorCodes.ERR_VALIDATION.message);
                    let details = res.body.details[0];
                    details.should.have.property('path').eql(["password"])
                    done();
                });
        });
    });
});