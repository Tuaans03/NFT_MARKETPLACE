const nodemailer = require('nodemailer');
const config =require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
transport
    .verify()
    .then( () => logger.info('Connected to email sever'))
    .catch( () => logger.error('Connect to email failed'));

const sendEmail = async(to,subject,html)  =>{
    const msg = {from:config.email.from,to,html};
    await transport.sendMail(msg);
}


const sendResetPasswordEmail = async(to,token,name) =>{
    const subject = 'đặt lại mật khẩu';
    const reserPasswordUrl = `${config.base_url}/api/v1/auth/reset-password?token=${token}`;
    await sendEmail(to,subject,html);
}

const sendVerificationEmail = async(to,token,name) =>{
    const subject = 'Xác thực email';
    const verifyEmailUrl = `${config.base_url}/api/v1/auth/verify-email?token=${token}}`;
    await sendEmail(to,subject,html);
}

const sendMsgEmail = async(data) =>{
    const subject = 'Xác nhân lịch hẹn khám';
    if(!data.deniedReason){
        const html = `${data.fullName} , ${data.time} ,${data.place},${data.stt}`;

    }
    else{
        const html = `${data.fullName} , ${data.deniedReason}`
    }
    await sendEmail(data.email,subject,html);
}


module.exports ={
    transport,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail,
    sendMsgEmail
}