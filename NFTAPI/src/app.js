const express = require("express");
const helmet = require('helmet');
const morgan = require('./config/morgan');
const methodOveride = require('method-override');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const { config } = require("dotenv");
const{requestRateLimiter} = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const {errorConverter,errorHandler} = require('./middlewares/error')
const ApiError = require('./utils/ApiError');
const httpStatus = require("http-status");

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


//limit repeated failed requests to auth endpoints
if(config.env === 'production'){
  app.use('/api/v1/auth',requestRateLimiter);
}

app.use('/api/v1',routes);

app.use((req,res,next) =>{
  next(new ApiError(httpStatus.NOT_FOUND,'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

module.exports = app;