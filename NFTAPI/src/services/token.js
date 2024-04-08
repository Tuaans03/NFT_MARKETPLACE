const { User, Token } = require("../models");
const { tokenTypes } = require("../config/tokens");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Không tìm thấy token");
  }
  return tokenDoc;
};

const generateAuthToken = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );
  const refeshTokenExpires = moment().add(
    config.jwt.refeshExpirationDays,
    "days"
  );
  const refeshToken = generateToken(
    user.id,
    refeshTokenExpires,
    tokenTypes.REFESH
  );
  await saveToken(refeshToken, user.id, refeshTokenExpires, tokenTypes.REFESH);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refesh: {
      token: refeshToken,
      expires: refeshTokenExpires.toDate(),
    },
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "không tìm thấy người dùng nào với email này"
    );
  }
  const expires = moment().add(config.jwt.accessExpirationMinutes, "minutes");
  const reserPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    reserPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return reserPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

const extractTokenFromHeader = (request) => {
  const [type, token] = request.headers.authorization?.split(" ") ?? [];
  return type === "Bearer" ? token : undefined;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthToken,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  extractTokenFromHeader,
};
