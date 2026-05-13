import mongoose from "mongoose";
import { userModel } from "../Models/userModel.js";

const farmername = async (req, res, next) => {
    console.log("in farmer");
    const { farmer_id } = req.body;

    try {
        // Ensure farmer_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(farmer_id)) {
            return res.status(400).json({ success: false, message: "Invalid farmer ID" });
        }

        const farmer = await userModel.findOne({ _id: farmer_id });

        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer not found" });
        }

        console.log(farmer.name); // Corrected logging

        req.farmerName = farmer.name; // Store farmer name in req object
        next(); // Proceed to next middleware
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default farmername;
