import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// General API Rate Limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again later.' }
});

// Stricter Rate Limiting for Admin Login
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Helmet Config
export const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow images to be loaded by frontend on different origin
});
