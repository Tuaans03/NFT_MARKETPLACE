const { User, Role } = require("../models");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { tokenService, roleSerivce } = require("../services");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");

const auth = catchAsync(async (req, res, next) => {
  const token = tokenService.extractTokenFromHeader(req);
  if (!token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Không có quyền");
  }
  const payload = jwt.verify(token, config.jwt.secret);
  const user = await User.findOne({ _id: payload.sub });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Không có quyền");
  }
  req.user = user;
  next();
});

const authorize = (rolesAllow) => async (req, res, next) => {
  for (const role of rolesAllow) {
    const roleNow = await Role.findOne({ roleIndex: role });
    const roleId = roleNow?._id;
    if (req.user.roles.includes(roleId)) {
      return next();
    }
  }
  return next(new ApiError(httpStatus.FORBIDDEN, "Không có quyền"));
};

module.exports = { auth, authorize };
