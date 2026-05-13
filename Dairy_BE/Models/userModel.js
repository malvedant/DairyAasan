import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  D_owner_id: { type: String, required: true },
});

const milkRateSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    
    fatRate: { type: Number, required: true },   // ✅ NEW
    snfRate: { type: Number, required: true },   // ✅ NEW

    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);


const advancePaymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    farmerName: { type: String, required: true },
    emiExpireDate: { type: Date, required: true, default: Date.now },
    advancePayment: { type: Number, required: true },
    year: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    farmerName:{type: String, required: true,},
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    milkBill: { type: Number, required: true },
    cowFeedBill: { type: Number, required: true },
    emi: { type: Number, required: true },
    finalBill: { type: Number, required: true },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
  },
  { timestamps: true }
);


const emiTransactionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, default: Date.now },
    farmerName:{type: String, required: true,},
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    emiExpireDate: { type: Date, required: true, default: Date.now },
    totalAdvancePrice: { type: Number, required: true },
    remainingAdvancePrice: { type: Number, required: true },
    monthlyEmi: { type: Number, required: true },
    count: { type: Number, required: true },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    }
  },
  { timestamps: true }
);

const dailyMilkTransactionSchema = new mongoose.Schema(
  {
    shift: {
      type: String,
      enum: ["Morning", "Evening"],
      required: true,
    },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    liters: { type: Number, required: true },
    fat: { type: Number, required: true },
    total_value: { type: Number, required: true },
    farmerName: { type: String, required: true },
  },
  { timestamps: true } 
);

const otpSchema = new mongoose.Schema(
  {
    otp: { type: String, default: "" },
    expireAt: { type: Number, default: 0 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const cowFeedSchema = new mongoose.Schema(
  {
    cowFeedName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const allocatedCowFeedSchema = new mongoose.Schema(
  {
    cowFeedName: { type: String, required: true },
    farmerName: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    price: { type: Number, required: true },
    allocated_bags: { type: Number, required: true },
    D_owner_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    farmer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cowFeed_id: {
      type: mongoose.Schema.Types.String,
      ref: "cowFeed",
      required: true,
    },

    total_cowFeed_price: { type: Number, required: true },
  },
  { timestamps: true }
);

// const farmerSchema =new mongoose.Schema({
//     name:{type:String,required:true},
//     email:{type:String,required:true,unique:true},
//     phone:{type:String,required:true,unique:true},
//     password:{type:String,required:true},
//     D_owner_id:{type:String,required:true},
//     role:{type:String,required:true},
// })


const milkSchema = new mongoose.Schema({
  farmerId: String,
  milkQuantity: Number,
  fatPercentage: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// export default mongoose.model("MilkRecord", milkSchema);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
const milkModel=  mongoose.models.milk || mongoose.model("MilkRecord", milkSchema);

const paymentModel = mongoose.models.payment || mongoose.model("payment", paymentSchema);
const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);
const milkRateModel =
  mongoose.models.milkRate || mongoose.model("milkRate", milkRateSchema);
const dailyMilkTransactionModel =
  mongoose.models.dailyMilkTransaction ||
  mongoose.model("dailyMilkTransaction", dailyMilkTransactionSchema);
const cowFeedModel =
  mongoose.models.cowFeed || mongoose.model("cowFeed", cowFeedSchema);
  
  const advancePaymentModel= mongoose.models.advancePayment || mongoose.model("advancePayment",advancePaymentSchema);

const allocatedCowFeedModel = mongoose.models.allocatedCowFeed || mongoose.model("allocatedCowFeed",allocatedCowFeedSchema);
emiTransactionSchema
const emiTransactionModel = mongoose.models.emiTransaction || mongoose.model("emitransaction",emiTransactionSchema);

export {
  userModel,
  paymentModel,
  otpModel,
  milkRateModel,
  advancePaymentModel,
  dailyMilkTransactionModel,
  cowFeedModel,
  allocatedCowFeedModel,
  emiTransactionModel,
  milkModel
};

/**
 RateTable(
    Date,
    Price,
    Fat,

    created_by,
    updated_by,
    created_at,
    updated_at
 )

 dailyMilkTracasctionsTable(
    Shift,
    Date,
    Price (Forign Key RateTable),
    farmer (Forign Key UserModel/FarmerModel)
    liters ()
    Total_Values()
    Fat()

    created_by,
    updated_by,
    created_at,
    updated_at
 )
 */
