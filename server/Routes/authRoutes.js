import express from 'express';
import { isAuthenticated , login, logout, register, resetOtp, resetPassword, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/UserAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login',login)
authRouter.post('/logout', logout)
authRouter.post('/send-verify-otp', userAuth,sendVerifyOtp)
authRouter.post('/verify-account', userAuth,verifyEmail)
authRouter.get('/is-auth', userAuth,isAuthenticated)
authRouter.post('/send-reset-otp', resetOtp)
authRouter.post('/send-reset-password', resetPassword)

export default authRouter;
