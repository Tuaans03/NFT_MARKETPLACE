const rateLimit = require("express-rate-limit");

const requestRateLimiter = rateLimit({
  WindowMs: 15 * 60 * 1000,
  max: 15,
  skipSuccessfulRequests: true,
  message: "Quá nhiều yêu cầu thất bại từ địa chỉ IP này,vui lòng thử lại sau",
});

module.exports = { requestRateLimiter };
