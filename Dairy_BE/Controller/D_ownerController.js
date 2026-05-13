import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";

import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import {
  userModel,
  otpModel,
  milkRateModel,
  dailyMilkTransactionModel,
  cowFeedModel,
  allocatedCowFeedModel,
  advancePaymentModel,
  paymentModel,
  emiTransactionModel,
   milkModel
} from "../Models/userModel.js"; 
import transporter from "../Config/nodeMailer.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../Config/emailTemplates.js";

export const getMilkData = async (req, res) => {
  try {
    const { farmer_name } = req.query;

    const espURL = `http://10.159.215.94/get-data?farmer=${encodeURIComponent(farmer_name)}`;

    const response = await axios.get(espURL, { timeout: 5000 });
 console.log("hi iam in snf ");
    const { fat, liters, snf } = response.data;

    // ✅ Only pass data (no price calculation)
    const dataArray = [fat, snf, liters];
    const stringData = JSON.stringify(dataArray);

    res.status(200).json({
      success: true,
      message: "Milk data fetched",
      data: stringData
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "ESP fetch failed",
      data: null
    });
  }
};
// app.post("/api/milk-data", async (req, res) => {
 
// });

export const getAllFarmers = async (req, res) => {
  try {
    const { D_owner_id, role } = req.body;

    if (!D_owner_id || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const allFarmers = await userModel.find({ role, D_owner_id });

    if (!allFarmers.length) {
      return res.json({ success: true, message: "No farmers found", data: [] });
    }

    return res.json({ success: true, data: allFarmers });
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const addFarmer = async (req, res) => {
  try {
    const { name, email, phone, role, D_owner_id, password } = req.body;
    if (!name || !email || !phone || !password || !role || !D_owner_id) {
      return res.json({ success: false, message: "missing details" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "user already exist" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const newfarmer = new userModel({
      name,
      email,
      password: hasedPassword,
      D_owner_id,
      role,
      phone,
    });
    await newfarmer.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "welcome to the Farm-Dairy Website",
      text: `you as ${role}  logged to the Farm-Dairy Website with the email is ${email}`,
    };
    
    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "farmer added successfull!!" });
  } catch (error) {
    return res.json({ succsess: false, message: error.message });
  }
};

export const deleteFarmer = async (req, res) => {
  try {
    const { farmer_id } = req.body;
    if (!farmer_id) {
      return res.json({ succsess: false, message: "missing details" });
    }

    await userModel.deleteOne({ _id: farmer_id });
    res.json({ success: true, message: "farmer deletaed successfully" });
  } catch (error) {
    return res.json({ succsess: false, message: error.message });
  }
};

export const setMilkRate = async (req, res) => {
  try {
    const { date, fatRate, snfRate, D_owner_id } = req.body;

    if (!date || !fatRate || !snfRate || !D_owner_id) {
      return res.json({ success: false, message: "Missing details" });
    }

    const formattedDate = new Date(date);

    const existing = await milkRateModel.findOne({
      date: formattedDate,
      D_owner_id,
    });

    if (existing) {
      return res.json({
        success: false,
        message: "Rate already set. Use edit option.",
      });
    }

    const newRate = new milkRateModel({
      date: formattedDate,
      fatRate,
      snfRate,
      D_owner_id,
    });

    await newRate.save();

    res.json({
      success: true,
      message: "Milk rates set successfully",
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addFarmerMilkCount = async (req, res) => {
  try {
    const {
      date,
      fat,
      price,
      liters,
      total_value,
      shift,
      D_owner_id,
      farmer_id,
    } = req.body;
    const farmerName = req.farmerName;

    if (
      !date ||
      !fat ||
      !price ||
      !farmer_id ||
      !D_owner_id ||
      !liters ||
      !shift ||
      !total_value ||
      !farmerName
    ) {
      return res.json({ success: false, message: "Missing details" });
    }

    const formattedDate = new Date(date);

    const isMilkPriceSet = await milkRateModel.findOne({ date: formattedDate });

    if (!isMilkPriceSet) {
      return res.json({
        success: false,
        message: `Plese set the milk price for date ${date}`,
      });
    }

    const newDailyMilkTransaction = new dailyMilkTransactionModel({
      date: formattedDate,
      price,
      fat,
      total_value,
      liters,
      shift,
      D_owner_id,
      farmer_id,
      farmerName,
    });

    await newDailyMilkTransaction.save();
    const newFarmer=await userModel.findOne({_id:farmer_id});
    const FarmerEmail=newFarmer.email

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: FarmerEmail,
    subject: "Welcome to the Farm-Dairy Website",
    html: `
    <p style="font-size: 16px; color: #333;">Your milk details have been recorded:</p>
    <table style="
        width: 100%;
        max-width: 600px;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        border: 1px solid #4CAF50;
        text-align: left;
    ">
        <thead>
            <tr style="background-color: #4CAF50; color: white;">
                <th style="padding: 12px; border: 1px solid #ddd;">Date</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Shift</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Fat</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Price</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Liters</th>
                <th style="padding: 12px; border: 1px solid #ddd;">Total Milk Price</th>
            </tr>
        </thead>
        <tbody>
            <tr style="background-color: #f9f9f9; transition: background 0.3s ease-in-out;">
                <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${shift}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${fat}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${price}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${liters}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${total_value}</td>
            </tr>
        </tbody>
    </table>
    <p style="font-size: 14px; color: #333;">Thank you for using <strong>Farm-Dairy!</strong></p>
`,
};

await transporter.sendMail(mailOptions);


    res.json({
      success: true,
      message: `farmers ${liters} Milk added with ${price} `,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const getMilkCountdetails = async (req, res) => {
  const { farmer_id, date } = req.body;
  try {
    if (!farmer_id || !date) {
      return res.json({ success: false, message: "Missing details" });
    }

    const milkTransaction = await dailyMilkTransactionModel.find({
      date,
      farmer_id,
    });

    if (!milkTransaction.length) {
      return res.json({
        success: true,
        message: "No Transaction found",
        data: [],
      });
    }

    return res.json({ success: true, data: milkTransaction });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const getAllMilkCollectionAsPerDate = async (req, res) => {
  try {
    console.log("in milk");
    const { date, D_owner_id } = req.body;
    if (!date || !D_owner_id) {
      return res.json({ data: false, message: "missing details" });
    }
    const milkTransaction = await dailyMilkTransactionModel.find({
      D_owner_id,
      date,
    });

    if (!milkTransaction.length) {
      return res
        .status(200)
        .json({ success: true, message: "No Transaction found", data: [] });
    }

    return res.status(200).json({ success: true, data: milkTransaction });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerAllMilkTransaction = async (req, res) => {
  try {
    const { farmer_id, D_owner_id, startDate, endDate } = req.body;

    if (!farmer_id || !D_owner_id || !startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    // Convert startDate & endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999); // Ensure it includes full day

    const milkTransaction = await dailyMilkTransactionModel.find({
      farmer_id,
      D_owner_id,
      date: { $gte: start, $lte: end },
    });

    if (!milkTransaction.length) {
      return res
        .status(200)
        .json({ success: true, message: "No Transaction found", data: [] });
    }

    return res.status(200).json({ success: true, data: milkTransaction });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTodaysMilkPrice = async (req, res) => {
  try {
    const { date, D_owner_id } = req.body;

    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "Missing details" });
    }

    const data = await milkRateModel.findOne({ date, D_owner_id });

    if (!data) {
      return res.json({
        success: false,
        message: "Milk rate not set",
      });
    }

    return res.json({
      success: true,
      data: {
        fatRate: data.fatRate,
        snfRate: data.snfRate,
      },
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const todaysMilkCountDetails = async (req, res) => {
  try {
    const { date, D_owner_id } = req.body;

    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "Missing details" });
    }

    const newtodaysMilkCountDetails = await dailyMilkTransactionModel.find({
      date,
      D_owner_id,
    });

    if (!newtodaysMilkCountDetails) {
      return res.json({
        success: false,
        message: "Milk price was not set",
        data: null,
      });
    }
    return res.json({ success: true, data: newtodaysMilkCountDetails });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const addCowFeedStock = async (req, res) => {
  try {
    const { cowFeedName, date, price, D_owner_id, stock, cowFeed_id } =
      req.body;

    if (!cowFeedName || !date || !price || !D_owner_id || !stock) {
      res.json({ success: false, message: "missing Details!" });
    }
    if (!cowFeed_id) {
      const formattedDate = new Date(date);
      const newCowFeed = new cowFeedModel({
        date: formattedDate,
        price,
        stock,
        D_owner_id,
        cowFeedName,
      });

      await newCowFeed.save();

      res.json({
        success: true,
        message: `${cowFeedName}'s ${stock} bags addedd in stock with price ${price} `,
      });
    } else {
      const _id = cowFeed_id;
      const cowFeed = await cowFeedModel.findOneAndUpdate(
        { _id },
        {
          $inc: { stock: stock },
          $set: { price: price },
        },
        { new: true }
      );
      res.json({
        success: true,
        message: `${cowFeedName}'s ${stock} bags updated in stock with price ${price} `,
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const getCowFeedDetails = async (req, res) => {
  try {
    const { D_owner_id } = req.body;

    if (!D_owner_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const cowFeedData = await cowFeedModel.find({ D_owner_id });

    if (cowFeedData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No cow feed data available",
      });
    }

    return res.status(200).json({ success: true, data: cowFeedData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const allocateCowFeed = async (req, res) => {
  try {
    const {
      price,
      allocated_bags,
      cowFeedName,
      cowFeed_id,
      D_owner_id,
      farmer_id,
      total_cowFeed_price,
      date,
    } = req.body;
    const farmerName = req.farmerName;

    if (
      !price ||
      !date ||
      !allocated_bags ||
      !cowFeedName ||
      !cowFeed_id ||
      !D_owner_id ||
      !farmer_id ||
      !total_cowFeed_price ||
      !farmerName
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    if(allocated_bags<1){
      return res
      .status(400)
      .json({ success: false, message: "invalid allocated bags!" });
  }
    
    const _id = cowFeed_id;
    const available_stock = await cowFeedModel.findOne({ _id });

    if (available_stock.stock < 1) {
      return res.status(400).json({
        success: false,
        message: `${cowFeedName} stock is not avialable `,
      });
    }
    if (available_stock.stock < allocated_bags) {
      return res.status(400).json({
        success: false,
        message: `${cowFeedName} stock is only ${available_stock.stock} you can only allocate  ${available_stock.stock} bags `,
      });
    }

    const formattedDate = new Date(date);
    const newAllocatedCowFeed = new allocatedCowFeedModel({
      date: formattedDate,
      price,
      farmerName,
      D_owner_id,
      cowFeedName,
      cowFeed_id,
      farmer_id,
      allocated_bags,
      total_cowFeed_price,
    });


    const newFarmer=await userModel.findOne({_id:farmer_id});
    const FarmerEmail=newFarmer.email

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: FarmerEmail,
    subject: "Welcome to the Farm-Dairy Website",
    html: `
    <p style="font-size: 16px; color: #333;">Cow Feed Allocated:</p>
    <table style="
        width: 100%;
        max-width: 600px;
        border-collapse: collapse;
        border: 1px solid #4CAF50;
        font-family: Arial, sans-serif;
    ">
        <tr style="background-color: #4CAF50; color: white; text-align: left;">
            <th style="padding: 10px; border: 1px solid #ddd;">Date</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Cow Feed Name</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Allocated Bags</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Total Feed Price</th>
        </tr>
        <tr style="background-color: #f9f9f9; text-align: left;">
            <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${cowFeedName}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${price}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${allocated_bags}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${total_cowFeed_price}</td>
        </tr>
    </table>
    <p style="font-size: 14px; color: #333;">Thank you for using <strong>Farm-Dairy!</strong></p>
`,
};
await newAllocatedCowFeed.save();
await transporter.sendMail(mailOptions);
    


    await cowFeedModel.findOneAndUpdate(
      { _id },
      {
        $inc: { stock: -allocated_bags },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `${allocated_bags} bags of ${cowFeedName} are allocated to the farmer ${farmerName}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCowFeedTrannsaction = async (req, res) => {
  try {
    const { D_owner_id } = req.body;

    if (!D_owner_id) {
      return res.json({ success: false, message: "missing details" });
    }
    const newAllCowFeedTransactionData = await allocatedCowFeedModel.find({
      D_owner_id,
    });
    if (!newAllCowFeedTransactionData) {
      return res.json({ success: false, message: "No cowFeed Transactions! " });
    }
    res.json({ success: true, data: newAllCowFeedTransactionData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCowFeedTransactionAsPerDate = async (req, res) => {
  try {
    const { D_owner_id, date } = req.body;
    if (!D_owner_id || !date) {
      return res.json({ success: false, message: "missing Details!" });
    }
    const formattedDate = new Date(date);
    const newAllCowFeedTransactionAsPerDateData =
      await allocatedCowFeedModel.find({ D_owner_id, date: formattedDate });
    if (!newAllCowFeedTransactionAsPerDateData) {
      return res.json({
        success: false,
        message: "no cowFed transaction found",
      });
    }
    res.json({ success: true, data: newAllCowFeedTransactionAsPerDateData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerAllCowFeedTransaction = async (req, res) => {
  try {
    const { D_owner_id, farmer_id, startDate, endDate } = req.body;
    if (!D_owner_id || !farmer_id) {
      return res.jsion({ success: false, message: "missing Details" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);
    const newFarmerAllCowFeedTransaction = await allocatedCowFeedModel.find({
      D_owner_id,
      farmer_id,
      date: { $gte: start, $lte: end },
    });
    if (!newFarmerAllCowFeedTransaction) {
      return res.json({
        success: false,
        message: "no such farmer's cowFeed transaction found",
      });
    }
    res.json({ success: true, data: newFarmerAllCowFeedTransaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCowFeedTransactionOfFarmerAsPerDate = async (req, res) => {
  try {
    const { farmer_id, D_owner_id, date } = req.body;

    if (!farmer_id || !D_owner_id || !date) {
      return res.json({ success: false, message: "missing Details" });
    }
    const formattedDate = new Date(date);
    const newCowFeedTransactionOfFarmerAsPerDate =
      await allocatedCowFeedModel.find({
        D_owner_id,
        farmer_id,
        date: formattedDate,
      });

    if (!newCowFeedTransactionOfFarmerAsPerDate) {
      return res.json({
        success: false,
        message: "no cowFeed Transction found!",
      });
    }

    res.json({ success: true, data: newCowFeedTransactionOfFarmerAsPerDate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const makeAdvancePayment = async (req, res) => {
  try {
    const {
      farmer_id,

      D_owner_id,
      advancePayment,
      monthlyEmi,
      year,
      date,
      emiExpireDate,
    } = req.body;
    const farmerName = req.farmerName;

    if (
      !farmer_id ||
      !D_owner_id ||
      !advancePayment ||
      !monthlyEmi ||
      !year ||
      !date ||
      !emiExpireDate ||
      !farmerName
    ) {
      return res.json({ success: false, message: "missing details" });
    }
    const formattedDate = new Date(date);
    const formattedEmiExpireDate = new Date(emiExpireDate);
    const newAdvancePayment = new advancePaymentModel({
      date: formattedDate,
      farmer_id,
      D_owner_id,
      advancePayment,
      farmerName,
      monthlyEmi,
      year,
      emiExpireDate: formattedEmiExpireDate,
    });
    await newAdvancePayment.save();
    res.json({
      success: true,
      message: `farmer ${farmerName} has allocated ${advancePayment}rs for ${year} year with monthly Emi ${monthlyEmi}rs`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAdvancePaymentList = async (req, res) => {
  try {
    const { D_owner_id } = req.body;
    if (!D_owner_id) {
      return res.json({ success: false, message: "missing Deatils!" });
    }
    const newAllAdvancePaymentList = await advancePaymentModel.find({
      D_owner_id,
    });
    if (!newAllAdvancePaymentList) {
      return res.json({ success: false, message: "no data found" });
    }
    res.json({ success: true, data: newAllAdvancePaymentList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMilkPriceHistory = async (req, res) => {
  try {
    const { D_owner_id } = req.body;
    if (!D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }
    const newMilkPriceHistory = await milkRateModel.find({ D_owner_id });
    if (!newMilkPriceHistory) {
      return res.json({ success: false, message: "no milk Price found" });
    }
    res.json({ success: true, data: newMilkPriceHistory });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMilkPriceAtThatDate = async (req, res) => {
  try {
    const { D_owner_id, date } = req.body;
    if (!D_owner_id || !date) {
      return res.json({ success: false, message: "missing Details" });
    }
    const newMilkPriceAtThatDate = await milkRateModel.findOne({ D_owner_id, date });
    if (!newMilkPriceAtThatDate) {
      return res.json({ success: false, message: "no data Found" });
    }
    res.json({ success: true, data: newMilkPriceAtThatDate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateTotalMilkPriceOfFarmer = async (req, res) => {
  try {
    let totalMilkPrice = 0;

    const { D_owner_id, farmer_id, startDate, endDate } = req.body;

    if (!D_owner_id || !farmer_id || !startDate || !endDate) {
      return res.json({ success: false, message: "Missing details" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await dailyMilkTransactionModel.find({
      D_owner_id,
      farmer_id,
      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalMilkPrice += item.total_value;
    });

    return res.json({ success: true, totalMilkPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateTotalCowFeedPrice = async (req, res) => {
  let totalCowFeedPrice = 0;
  try {
    const { D_owner_id, farmer_id, startDate, endDate } = req.body;
    if (!D_owner_id || !farmer_id || !startDate || !endDate) {
      return res.json({ success: false, message: "missing deatils" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setUTCHours(23, 59, 59, 999);

    const newTotalCowFeedPrice = await allocatedCowFeedModel.find({
      D_owner_id,
      farmer_id,
      date: { $gte: start, $lte: end },
    });
    if (totalCowFeedPrice.length == 0) {
      return res.json({ success: false, message: "no data found" });
    }

    newTotalCowFeedPrice.forEach((item) => {
      totalCowFeedPrice += item.total_cowFeed_price;
    });
    console.log(totalCowFeedPrice);
    res.json({ success: true, data: totalCowFeedPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMonthlyEmi = async (req, res) => {
  try {
    const { D_owner_id, farmer_id } = req.body;

    if (!D_owner_id || !farmer_id) {
      return res.json({ success: false, message: "Missing details" });
    }

    const newMonthlyEmi = await advancePaymentModel.findOne({
      D_owner_id,
      farmer_id,
    });

    if (!newMonthlyEmi) {
      return res.json({ success: false, message: "No data found" });
    }

    res.json({ success: true, data: newMonthlyEmi.monthlyEmi });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateFinalTotalPrice = async (req, res) => {
  try {
    let finalTotalPrice = 0;
    const { D_owner_id, farmer_id, startDate, endDate } = req.body;

    if (!D_owner_id || !farmer_id || !startDate || !endDate) {
      return res.json({ success: false, message: "Missing details" });
    }

    const BASE_URL = "http://localhost:4000/api/D_owner";

    const milkPriceResponse = await axios.post(
      `${BASE_URL}/calculate-total-milk-price`,
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const cowFeedPriceResponse = await axios.post(
      `${BASE_URL}/calculate-total-allocated-cowFeed`,
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const emiResponse = await axios.post(`${BASE_URL}/get-monthly-emi`, {
      D_owner_id,
      farmer_id,
    });

    const totalMilkPrice = milkPriceResponse.data.success
      ? milkPriceResponse.data.totalMilkPrice
      : 0;
    const totalCowFeedPrice = cowFeedPriceResponse.data.success
      ? cowFeedPriceResponse.data.data
      : 0;
    const monthlyEmi = emiResponse.data.success ? emiResponse.data.data : 0;

    finalTotalPrice = (totalMilkPrice - totalCowFeedPrice - monthlyEmi).toFixed(
      2
    );

    console.log(totalCowFeedPrice);
    console.log(monthlyEmi);
    console.log(totalMilkPrice);
    console.log(finalTotalPrice);
    return res.json({
      success: true,
      totalMilkPrice,
      totalCowFeedPrice,
      monthlyEmi,
      finalTotalPrice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBill = async (req, res) => {
  try {
    const { D_owner_id, farmer_id, startDate, endDate } = req.body;
    console.log(startDate);
    console.log(endDate);
    const farmerName = req.farmerName;
    if (!D_owner_id || !farmer_id || !startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    const calculateFinalBillResponse = await axios.post(
      "http://localhost:4000/api/D_owner/calculate-final-total-price",
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const calculateTotalMilkpriceResponse = await axios.post(
      "http://localhost:4000/api/D_owner/calculate-total-milk-price",
      { D_owner_id, farmer_id, startDate, endDate }
    );

    const calculateTotalCowFeedpriceResponse = await axios.post(
      "http://localhost:4000/api/D_owner/calculate-total-allocated-cowFeed",
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const monthlyEmiResponse = await axios.post(
      "http://localhost:4000/api/D_owner/get-monthly-emi",
      { D_owner_id, farmer_id }
    );

    const milkTransactionResponse = await axios.post(
      "http://localhost:4000/api/D_owner/get-farmer-all-milk-transaction",
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const cowFeedTransactionResponse = await axios.post(
      "http://localhost:4000/api/D_owner/get-farmer-cowfeed-transactions",
      { D_owner_id, farmer_id, startDate, endDate }
    );
    const emiTransactionResponse = await axios.post(
      "http://localhost:4000/api/D_owner/get-all-emi-transaction",
      { D_owner_id, farmer_id }
    );

    const milkTransactions = milkTransactionResponse?.data?.data || [];

    const cowFeedTransactions = cowFeedTransactionResponse?.data?.data || [];
    const emiTransactions = emiTransactionResponse?.data?.data || [];

    const total_MilkPrice = calculateTotalMilkpriceResponse.data.totalMilkPrice;
    const total_CowFeedprice = calculateTotalCowFeedpriceResponse.data.data;
    const emi_Price = monthlyEmiResponse.data.data;
    const Final_Price = calculateFinalBillResponse.data.finalTotalPrice;
    const farmer = farmerName;
    console.log(farmer);
    console.log(startDate);
    console.log(endDate);

    res.json({
      success: true,
      milkTransactions,
      cowFeedTransactions,
      emiTransactions,
      total_MilkPrice,
      total_CowFeedprice,
      emi_Price,
      Final_Price,
      farmer,
      startDate,
      endDate,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMilkTransactionPdf = async (req, res) => {
  try {
    const { farmer_id, D_owner_id, D_owner_email } = req.body;

    if (!farmer_id || !D_owner_id) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const farmer = await userModel.findOne({ _id: farmer_id });
    if (!farmer) {
      return res.json({ success: false, message: "Farmer not found" });
    }

    const farmerEmail = farmer.email;

    if (!farmerEmail) {
      return res.json({ success: false, message: "Farmer email not found" });
    }

    if (!req.pdfPath) {
      return res.json({ success: false, message: "PDF generation failed" });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: farmerEmail,
      subject: "Monthly Dairy Transaction Details",
      text: `Dear ${farmer.name},\n\nAttached is your monthly dairy transaction report.\n\nBest regards,\nFarm-Dairy Team`,
      attachments: [
        {
          filename: `MilkTransactions_${D_owner_id}_${farmer_id}.pdf`,
          path: req.pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);

    fs.unlinkSync(req.pdfPath);

    return res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const makePayment = async (req, res) => {
  try {
    console.log("in payment");
    const {
      D_owner_id,
      farmer_id,
      date,
      fromDate,
      toDate,
      milkBill,
      cowFeedBill,

      finalBill,
      emi,
    } = req.body;
    const farmerName = req.farmerName;
    console.log(date);
    console.log(fromDate);
    console.log(toDate);
    console.log(D_owner_id);
    console.log(farmer_id);
    console.log(milkBill);
    console.log(cowFeedBill);
    console.log(finalBill);
    console.log(emi);
    if (
      !D_owner_id ||
      !farmer_id ||
      !date ||
      !fromDate ||
      !toDate ||
      !milkBill ||
      !cowFeedBill ||
      !finalBill ||
      !emi
    ) {
      return res.json({ success: false, message: "missing Deatils" });
    }

    const newPayment = new paymentModel({
      date,
      fromDate,
      toDate,
      milkBill,
      cowFeedBill,
      farmerName,
      emi,
      finalBill,
      D_owner_id,
      farmer_id,
    });

    await newPayment.save();
    res.json({ success: true, message: "payment Successfull" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const makeEmipayment = async (req, res) => {
  try {
    const { D_owner_id, farmer_id, fromDate, toDate, date } = req.body;
    const farmerName = req.farmerName;
    if (!D_owner_id || !farmer_id || !fromDate || !toDate || !date) {
      return res.json({ success: false, message: "missing Details" });
    }
    const existingAdvancePayment = await advancePaymentModel.findOne({
      D_owner_id,
      farmer_id,
    });
    if (!existingAdvancePayment) {
      return res.json({
        success: false,
        message: "no advance payment data found",
      });
    }
    const existingMonthlyEmi = existingAdvancePayment.monthlyEmi;
    const existingAdvancePaymentPrice = existingAdvancePayment.advancePayment;
    const emiExpireDate = existingAdvancePayment.emiExpireDate;

    const lastEmiTransaction = await emiTransactionModel
      .findOne({
        D_owner_id,
        farmer_id,
      })
      .sort({ createdAt: -1 });

    if (lastEmiTransaction) {
      const count = lastEmiTransaction.count + 1;
      const remainingAdvancePrice =
        lastEmiTransaction.remainingAdvancePrice - existingMonthlyEmi;

      const newTransaction = await new emiTransactionModel({
        farmer_id,
        date,
        D_owner_id,
        fromDate,
        toDate,
        farmerName,
        count,
        remainingAdvancePrice,
        emiExpireDate,
        totalAdvancePrice: existingAdvancePaymentPrice,
        monthlyEmi: existingMonthlyEmi,
      });
      await newTransaction.save();
      res.json({ success: true, message: "emi Transaction Successfull" });
    } else {
      const count = 1;
      const remainingAdvancePrice =
        existingAdvancePaymentPrice - existingMonthlyEmi;

      const newTransaction = await new emiTransactionModel({
        farmer_id,
        date,
        D_owner_id,
        farmerName,
        fromDate,
        toDate,
        count,
        remainingAdvancePrice,
        emiExpireDate,
        totalAdvancePrice: existingAdvancePaymentPrice,
        monthlyEmi: existingMonthlyEmi,
      });
      await newTransaction.save();
      res.json({ success: true, message: "emi Transaction Successfull" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEmiTransaction = async (req, res) => {
  try {
    const { D_owner_id, farmer_id } = req.body;
    if (!D_owner_id || !farmer_id) {
      return res.json({ success: false, message: "missing Details" });
    }
    const newLastemiTransaction = await emiTransactionModel.find({
      D_owner_id,
      farmer_id,
    });

    return res.json({ success: true, data: newLastemiTransaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const callculateTodaysMilkCountAndPrice = async (req, res) => {
  try {
    const { date, D_owner_id } = req.body;
    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }

    let totalMilkCount = 0;
    let totalMilkPrice = 0;

    const transactions = await dailyMilkTransactionModel.find({
      D_owner_id,

      date,
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalMilkPrice += item.total_value;
    });
    transactions.forEach((item) => {
      totalMilkCount += item.liters;
    });

    return res.json({ success: true, totalMilkPrice, totalMilkCount });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const calculateCowFeedPriceAndBags = async (req, res) => {
  try {
    const { date, D_owner_id } = req.body;
    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }

    let totalAllocatedBags = 0;
    let totalcowFeedPrice = 0;

    const transactions = await allocatedCowFeedModel.find({
      D_owner_id,

      date,
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalcowFeedPrice += item.total_cowFeed_price;
    });
    transactions.forEach((item) => {
      totalAllocatedBags += item.allocated_bags;
    });

    return res.json({ success: true, totalAllocatedBags, totalcowFeedPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { D_owner_id } = req.body;
    if (!D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }
    const newPayments = await paymentModel.find({ D_owner_id });
    if (!newPayments) {
      return res.json({ success: false, message: "no Payments data Found" });
    }
    res.json({ success: true, data: newPayments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const tenDaysDairyOwnermilkCollection = async (req, res) => {
  try {
    let totalMilkPrice = 0;
    let totalMilkCount = 0;
    const { D_owner_id, fromDate, toDate } = req.body;
    if (!D_owner_id || !fromDate || !toDate) {
      return res.json({ success: false, message: "missing Details" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await dailyMilkTransactionModel.find({
      D_owner_id,

      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalMilkPrice += item.total_value;
    });
    transactions.forEach((item) => {
      totalMilkCount += item.liters;
    });
    res.json({ success: true, transactions, totalMilkCount, totalMilkPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const tenDaysDairyOwnerCowFeedAllocationData = async (req, res) => {
  try {
    let totalCowFeedBags = 0;
    let totalCowFeedPrice = 0;
    const { D_owner_id, fromDate, toDate } = req.body;
    if (!D_owner_id || !fromDate || !toDate) {
      return res.json({ success: false, message: "missing Details" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await allocatedCowFeedModel.find({
      D_owner_id,

      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalCowFeedBags += item.allocated_bags;
    });
    transactions.forEach((item) => {
      totalCowFeedPrice += item.total_cowFeed_price;
    });
    res.json({
      success: true,
      transactions,
      totalCowFeedBags,
      totalCowFeedPrice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllDairyOwnerEmiTransaction = async (req, res) => {
  try {
    const { D_owner_id } = req.body;
    if (!D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }
    const newLastemiTransaction = await emiTransactionModel.find({
      D_owner_id,
    });

    return res.json({ success: true, data: newLastemiTransaction });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const callculateFarmersTodaysMilkCountAndPrice = async (req, res) => {
  try {
    const { date, D_owner_id, farmer_id } = req.body;
    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }

    let totalMilkCount = 0;
    let totalMilkPrice = 0;

    const transactions = await dailyMilkTransactionModel.find({
      D_owner_id,
      farmer_id,
      date,
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalMilkPrice += item.total_value;
    });
    transactions.forEach((item) => {
      totalMilkCount += item.liters;
    });

    return res.json({
      success: true,
      totalMilkPrice,
      totalMilkCount,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const calculateFarmersTodaysCowFeedPriceAndBags = async (req, res) => {
  try {
    const { date, D_owner_id, farmer_id } = req.body;
    if (!date || !D_owner_id) {
      return res.json({ success: false, message: "missing Details" });
    }

    let totalAllocatedBags = 0;
    let totalcowFeedPrice = 0;

    const transactions = await allocatedCowFeedModel.find({
      D_owner_id,
      farmer_id,
      date,
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalcowFeedPrice += item.total_cowFeed_price;
    });
    transactions.forEach((item) => {
      totalAllocatedBags += item.allocated_bags;
    });

    return res.json({ success: true, totalAllocatedBags, totalcowFeedPrice,transactions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const farmersMilkpriceHistory=async(req,res)=>{
  try{
  const{D_owner_id,farmer_id}=req.body;
  if(!D_owner_id||!farmer_id){
    return res.json({success:false,message:"missing Details"});
  }
  const miilkPrices=await dailyMilkTransactionModel.find({D_owner_id,farmer_id});
  if(!miilkPrices){
    return res.json({success:false,message:"no milk rates data found"});
  }
  return res.json({success:true,data:miilkPrices});

  
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

}

export const farmersEmiTransactionHistory=async(req,res)=>{
  try{
const {D_owner_id,farmer_id}=req.body;
if(!D_owner_id||!farmer_id){
  return rmSync.json({success:false,message:"missing details"});
}
const emiTransaction=await emiTransactionModel.find({D_owner_id,farmer_id});
if(!emiTransaction){
  return res.json({success:false,message:"no emi Transaction Found"})
}
res.json({success:true,data:emiTransaction});
  }
  catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

}


export const farmerTenDaysMilkilkCollection = async (req, res) => {
  try {
    let totalMilkPrice = 0;
    let totalMilkCount = 0;
    const { D_owner_id, fromDate, toDate,farmer_id} = req.body;
    if (!D_owner_id || !fromDate || !toDate) {
      return res.json({ success: false, message: "missing Details" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await dailyMilkTransactionModel.find({
      D_owner_id,
     farmer_id,
      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalMilkPrice += item.total_value;
    });
    transactions.forEach((item) => {
      totalMilkCount += item.liters;
    });
    res.json({ success: true, transactions, totalMilkCount, totalMilkPrice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const farmersTenDaysCowFeed = async (req, res) => {
  try {
    let totalCowFeedBags = 0;
    let totalCowFeedPrice = 0;
    const { D_owner_id, fromDate, toDate ,farmer_id} = req.body;
    if (!D_owner_id || !fromDate || !toDate) {
      return res.json({ success: false, message: "missing Details" });
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setUTCHours(23, 59, 59, 999);

    const transactions = await allocatedCowFeedModel.find({
      D_owner_id,
      farmer_id,
      date: { $gte: start, $lte: end },
    });

    if (transactions.length === 0) {
      return res.json({ success: false, message: "No data found" });
    }

    transactions.forEach((item) => {
      totalCowFeedBags += item.allocated_bags;
    });
    transactions.forEach((item) => {
      totalCowFeedPrice += item.total_cowFeed_price;
    });
    res.json({
      success: true,
      transactions,
      totalCowFeedBags,
      totalCowFeedPrice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFarmerPaymentHistory=async(req,res)=>{
  try{
const{farmer_id,D_owner_id}=req.body;
if(!farmer_id||!D_owner_id){
  return res.json({success:false,message:"Missing Details"});
}
const farmerPaymenttransaction=await  paymentModel.find({D_owner_id,farmer_id});
if(!farmerPaymenttransaction){
  return res.json({success:false,message:"no Payment Transaction found"});

}
res.json({success:true,data:farmerPaymenttransaction});


  }
  catch(error){
    return res.status(500).json({ success: false, message: error.message });
  }

}
export const getFarmerAdvancePayment=async(req,res)=>{
  try{
const{D_owner_id,farmer_id}=req.body;
if(!D_owner_id||!farmer_id){
  return res.json({success:false,message:"missing Details"});
}
const farmerAdvancePayment=await advancePaymentModel.find({D_owner_id,farmer_id});
if(!farmerAdvancePayment){
  return res.json({success:false,message:"no Advance Payment Found"})
}
res.json({success:true,data:farmerAdvancePayment});

  }
  catch(error){
    return res.status(500).json({ success: false, message: error.message });
  }

}

export const editMilkPrice = async (req, res) => {
  try {
    const { D_owner_id, date, fatRate, snfRate } = req.body;

    // ✅ VALIDATION
    if (!D_owner_id || !date || !fatRate || !snfRate) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }

    // ✅ FIX DATE RANGE (IMPORTANT)
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // ✅ UPDATE
    const updatedMilkRate = await milkRateModel.findOneAndUpdate(
      {
        D_owner_id,
        date: { $gte: start, $lte: end },
      },
      {
        $set: {
          fatRate: Number(fatRate),
          snfRate: Number(snfRate),
        },
      },
      { new: true }
    );

    // ❌ NOT FOUND CASE
    if (!updatedMilkRate) {
      return res.json({
        success: false,
        message: "Rate not found for this date",
      });
    }

    // ✅ SUCCESS
    return res.json({
      success: true,
      message: `Milk rates updated successfully`,
      data: updatedMilkRate,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


