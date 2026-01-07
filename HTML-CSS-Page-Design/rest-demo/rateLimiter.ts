import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 30 * 1000, // 1 minute
  max: 3, // max 3 requests
  standardHeaders: true,  //RateLimit-Limit: 3 ,  RateLimit-Remaining: 0  , RateLimit-Reset: 60
  legacyHeaders: false,  //Disable old headers
  handler: (req, res) => {
    res.status(429).json({
      message: "Too many OTP requests. Please wait 30 seconds."
    });
  }
});
