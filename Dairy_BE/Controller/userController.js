import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel, otpModel } from "../Models/userModel.js"; // Use Named Import
import transporter from "../Config/nodeMailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../Config/emailTemplates.js";

export const register = async (req, res) => {
  const { name, email, phone, password, role,D_owner_id } = req.body;

  if (!name || !email || !phone || !password || !role ||!D_owner_id) {
    return res.json({ success: false, message: "missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "user already exist" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hasedPassword,
      role,
      phone,
      D_owner_id,
    });
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to the Farm-Dairy Website",
      text: `you as ${role}  logged to the Farm-Dairy Website with the email is ${email}`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Sign Up succesfull!!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { phone, password } = req.body;
  console.log(phone);
  console.log(password);

  if (!phone || !password) {
    return res.json({ success: false, message: "missing Details!" });
  }

  try {
    const user = await userModel.findOne({ phone });
    if (!user) {
      return res.json({ success: false, message: "invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "login succesfull!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const demo = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.json({ success: false, message: "missing Details!" });
  }
  res.json({ success: true, message: "welcome" });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "logged out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.json({ sucsess: false, message: "missing details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ sucsess: false, message: "user not found" });
    }
    const otpObj = await otpModel
      .findOne({ userId: user._id })
      .sort({ createdAt: -1 })
      .exec();
    console.log(otpObj);
    if (!otpObj) {
      return res.json({ sucsess: false, message: "OTP object not found" });
    }

    if (otpObj.expireAt < Date.now()) {
      return res.json({ sucsess: false, message: "otp expired" });
    }
    if (otpObj.otp === "" || otpObj.otp !== otp) {
      return res.json({ sucsess: false, message: "invalid otp" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      message: "email verified succesfully ,login succesfull!",
    });
  } catch (error) {
    return res.json({ sucsess: false, message: error.message });
  }
};
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ sucsess: false, message: "user not found" });
    }
    res.json({
      success: true,
      userData: {
        name: user.name,
         role:user.role,
        email: user.email,
        id: user._id,
        D_owner_id:user.D_owner_id
      },
    });
  } catch (error) {
    return res.json({ succsess: false, message: error.message });
  }
};
// export const getAllFarmers = async (req, res) => {
//   try {
//     console.log("in f data");
//     const { D_owner_id ,role} = req.body;
//     console.log(D_owner_id);
//     console.log(role);

//     if (!D_owner_id || !role) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing details" });
//     }

//     const allFarmers = await userModel.find({ role, D_owner_id });

//     if (!allFarmers.length) {
//       return res.json({ success: true, message: "No farmers found", data: [] });
//     }

//     return res.json({ success: true, data: allFarmers });
//   } catch (error) {
//     console.error("Error fetching farmers:", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const addFarmer = async (req, res) => {
//   console.log("hi");
//   try {
//     const { name, email, phone, role, D_owner_id, password } = req.body;
//     if (!name || !email || !phone || !password || !role || !D_owner_id) {
//       return res.json({ success: false, message: "missing details" });
//     }

//     const existingUser = await userModel.findOne({ email });
//     if (existingUser) {
//       return res.json({ success: false, message: "user already exist" });
//     }

//     const hasedPassword = await bcrypt.hash(password, 10);
//     const newfarmer = new userModel({
//       name,
//       email,
//       password: hasedPassword,
//       D_owner_id,
//       role,
//       phone,
//     });
//     await newfarmer.save();

//     const mailOptions = {
//       from: process.env.SENDER_EMAIL,
//       to: email,
//       subject: "welcome to the Farm-Dairy Website",
//       text: `you as ${role}  logged to the Farm-Dairy Website with the email is ${email}`,
//     };
//     await transporter.sendMail(mailOptions);

//     return res.json({ success: true, message: "farmer added successfull!!" });
//   } catch (error) {
//     return res.json({ succsess: false, message: error.message });
//   }
// };

// export const deleteFarmer = async (req, res) => {
//   try {
//     const { farmer_id } = req.body;
//     if (!farmer_id) {
//       return res.json({ succsess: false, message: "missing details" });
//     }

//     await userModel.deleteOne({ _id: farmer_id });
//     res.json({ success: true, message: "farmer deletaed successfully" });
//   } catch (error) {
//     return res.json({ succsess: false, message: error.message });
//   }
// };

import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // ✅ IMPORTANT

// 🔑 Create OpenAI client for Hugging Face
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.OPENAI_API_KEY, // your HF token (hf_xxx)
});

// 🚀 Controller function
export const runChat = async (req, res) => {
  const { userMessage } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "userMessage is required" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",

      messages: [
        {
          role: "system",
          content: `# 🐮 Gauri’s Dairy Management Context
Hi! I’m Gauri — your friendly dairy assistant.  
I help Ritesh (the dairy owner) manage farmers, track milk collection, calculate payments, and maintain feed inventory.  

---

## 👨‍🌾 Farmers and Records

1. *Farmer:* Vedant  
- Milk supplied: 42 litres/day  
- Fat percentage: 4.2%  
- SNF percentage: 8.3%  
- Rate: ₹42 per litre  
- Advance paid: ₹500  
- Feed allocated: ₹350  
- EMI due: ₹400  
- Last balance: ₹1,246  

2. *Farmer:* Shashank  
- Milk supplied: 38 litres/day  
- Fat: 4.6%  
- Rate: ₹46  
- Advance: ₹600  
- Feed: ₹500  
- EMI: ₹550  
- Balance: ₹1,850  

3. *Farmer:* Suyash  
- Milk: 35 litres/day  
- Fat: 3.9%  
- Rate: ₹39  
- Advance: ₹400  
- Feed: ₹250  
- EMI: ₹350  
- Balance: ₹1,100  

4. *Farmer:* Rutval  
- Milk: 30 litres/day  
- Fat: 4.0%  
- Rate: ₹40  
- Advance: ₹500  
- Feed: ₹300  
- EMI: ₹300  
- Balance: ₹1,200  

---

## 💰 Formula
1 Fat = ₹10  
Rate = Fat × 10  

---

## 🧮 Payment Example
42 × 42 = ₹1764  
Deductions = ₹1250  
Net = ₹514  

---

## 🐄 Feed Inventory
- Sonai Pend → ₹1100 (19 bags)  
- Warna Pend → ₹1000 (1199 bags)  
- Sonai MK → ₹1100 (12 bags)  
- Varna Khapri → ₹1200 (13 bags)  

---

## 🧠 Gauri Rules
- Reply in 2–4 lines  
- Be friendly  
- Help with dairy calculations  
- Use simple words  

Always reply as Gauri 🐮.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],

      max_tokens: 150,
      temperature: 0.7,
    });

    const responseMessage =
      completion.choices?.[0]?.message?.content || "No response from AI";

    res.json({
      success: true,
      response: responseMessage,
    });

  } catch (err) {
    console.error("❌ Error:", err?.message || err);

    res.status(500).json({
      success: false,
      error: err?.message || "Something went wrong",
    });
  }
};