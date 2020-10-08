#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();
const compression = require('compression')
const express = require('express');
const router = require('./routes/v1/routes');
const bearerToken = require('express-bearer-token');
const bodyParser = require('body-parser');
let morgan = require('morgan');
const logErrors = require('./errorHandlers/logErrors');
const errorHandler = require('./errorHandlers/errorHandler');
const errorCodes = require('./classes/CustomError').errorCodes;
const API_NAME = 'PaymentsAPI';

const app = express();

if(process.env.NODE_ENV !== 'test') {
    process.env.NODE_ENV = 'production';
    app.use(morgan('combined'));
}

app.use(compression())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
    res.send(API_NAME);
});

app.use(bearerToken());

app.use('/v1' , router);

app.use(logErrors);
app.use(errorHandler);


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`${API_NAME} running on: ${port}`)
});

module.exports = app //for testing