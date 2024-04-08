const express = require("express");
const helmet = require('helmet');
const morgan = require('./config/morgan');
const methodOveride = require('method-override');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');

const app = express();

if(config.env !== 'test'){
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

//use method-overide
app.use(methodOveride('LOCK'));

//set security HTTP headers
app.use(helmet());

//parse json request body
app.use(express.json());

//parse urlencodeed request body
app.use(express.urlencoded({extended:true}));

//sanitize request body
app.use(xss());
app.use(mongoSanitize());

//gzip compression
app.use(compression());

//ennable cors
app.use(cors());
app.options('*',cors());



