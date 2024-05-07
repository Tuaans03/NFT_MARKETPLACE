const moongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

let sever;

mongoose
  .connect(config.mongoose.url,config.mongoose.options)
  .then( () =>{
    logger.info('Connected to MongoDB');
    sever = app.listen( config.port, () =>{
        logger.info(`Listening to port ${config.port}`);
    })
  })
  .catch( (error) => {
    logger.error(error);
  })


const exitHandler = () =>{
    if(sever){
        sever.close( () =>{
            logger.info('Sever closed');
            process.exit(1);
        })
    }
    else{
        process.exit(1);
    }
}

const unexpectedErrorHandler = (error) =>{
    logger.error(error);
    exitHandler;
}

process.on('uncaughtException',unexpectedErrorHandler);
process.on('unhandledRejection',unexpectedErrorHandler);

process.on('SIGTERM',() =>{
    logger.info('SIGTERM received');
    if(sever){
        sever.close();
    }
})