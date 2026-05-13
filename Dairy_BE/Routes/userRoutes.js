import express from 'express';
import {  demo,  getUserData, login, logout, register,runChat,verifyEmail } from '../Controller/userController.js';
import { sendLoginOtp } from '../Controller/otpController.js';
import userAuth from '../Middleware/userAuth.js';

 const userRouter=express.Router();

 userRouter.post('/register',register);
 userRouter.post('/login',login);
 userRouter.post('/demo',demo);
 userRouter.post('/logout',logout);
 userRouter.post('/send-otp',sendLoginOtp);
 userRouter.post('/verify-otp',verifyEmail);
 userRouter.get('/data',userAuth,getUserData);
  userRouter.post('/runAi',runChat);
 

export default userRouter;