const { userService, tokenService } = require("./");
const { Token, User } = require("../models");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Email hoặc mật khẩu không chính xác"
    );
  }
  if (!user.isEmailVerified) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Yêu cầu xác thực email trước khi đăng nhập"
    );
  }
  user.numberLogined += 1;
  user.dateLastLogined = Date.now();
  await user.save();
  return user;
};

const logout = async (refeshToken) => {
  const refeshTokenDoc = await Token.findOne({
    token: refeshToken,
    type: tokenTypes.REFESH,
    blacklisted: false,
  });
  if (!refeshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Không tìm thấy");
  }
  await refeshTokenDoc.deleteOne();
};

const refeshToken = async (refreshToken) => {
  try {
    const refeshTokenDoc = await tokenService.verifyToken(
      refeshToken,
      tokenTypes.REFESH
    );
    const user = await userService.getUserById(refeshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refeshTokenDoc.deleteOne();
    return tokenService.generateAuthToken(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Không có quyền");
  }
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Đặt lại mật khẩu thất bại");
  }
};

const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Không có quyền");
  }
  return user;
};

const getUserByToken = async (token) => {
  const payload = jwt.verify(token, configq.jwt.secret);
  const user = await User.findOne({ _id: payload.sub }).populate("roles");
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Không có quyền");
  }
  return user;
};

module.exports = {
  login,
  logout,
  refeshToken,
  resetPassword,
  verifyEmail,
  getUserByToken,
};
