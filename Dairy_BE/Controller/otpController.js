import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel, otpModel } from '../Models/userModel.js';  // Use Named Import



import transporter from "../Config/nodeMailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../Config/emailTemplates.js";

export const sendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email)
    if (!email) {
      return res.json({ success: false, message: "missing email" });
    }
    const user=await userModel.findOne({
        email
    });
    if (!user) {
      return res.json({ success: false, message: "user not exits" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expireAt=Date.now() + 24 * 60 * 60 * 1000;

    const otpObj= new otpModel({
        otp:otp,
        expireAt:expireAt,
        userId:user._id
    });
    await otpObj.save()


    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Acount verification otp",

      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "verification OTP sent to your email",
    });
  } catch (error) {
    return res.json({ sucsess: false, message: error.message });
  }
};
