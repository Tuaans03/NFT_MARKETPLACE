const Joi = require('joi');
const {email,password} = require('./custom.validation');


const register={
    body: Joi.object().keys({
        email:Joi.string().required().custom(email),
        password:Joi.string().required().custom(email),
        fullName:Joi.string().required(),
    }),
}

const login = {
    body:Joi.object().keys({
        email:Joi.string().required().custom(email),
        password:Joi.string().required()
    })
}

const logout ={
    body: Joi.object().keys({
        refeshToken:Joi.string().required(),
    })
}

const refeshTokens = {
    body:Joi.object().keys({
        refeshToken:Joi.string().required()
    })
}

const forgotPassword ={
    body:Joi.object().keys({
        email:Joi.string().custom(password).required(),
    }),
}

const resetPassword ={
    query:Joi.object().keys({
        token:Joi.string().required(),
    }),
    body:Joi.object().keys({
        password:Joi.string().required().custom(password),
    })
}

const verifyEmail ={
    query:Joi.object().keys({
        token:Joi.string().required()
    })
}

const getUserByToken = {
    body:Joi.object().keys({
        token:Joi.string().required()
    })
}

module.exports = {
    register,
    login,
    logout,
    refeshTokens,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getUserByToken,
};