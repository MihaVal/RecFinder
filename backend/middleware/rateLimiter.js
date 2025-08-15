const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const generalLimiter = createRateLimiter(
  15 * 60 * 1000,
  100,
  'Too many requests from this IP, please try again later'
);

const authLimiter = createRateLimiter(
  15 * 60 * 1000,
  5,
  'Too many authentication attempts, please try again later'
);

const createEventLimiter = createRateLimiter(
  60 * 60 * 1000,
  10,
  'Too many events created, please try again later'
);

module.exports = {
  generalLimiter,
  authLimiter,
  createEventLimiter
};