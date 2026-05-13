import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDb from "./Config/mongoDb.js";
import userRouter from "./Routes/userRoutes.js";
import D_ownerRouter from "./Routes/D_ownerRoutes.js";

const app = express();
const port = process.env.PORT || 4000;

// 🔥 CONNECT DB
connectDb();

// 🔥 ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://10.159.215.94" ,
 
];

// 🔥 CORS CONFIG (VERY IMPORTANT)
app.use(
  cors({
    origin: function (origin, callback) {
      // ✅ Allow requests with no origin (ESP32 / Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 🔥 HANDLE PREFLIGHT REQUESTS
app.options("*", cors());

// 🔥 MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 OPTIONAL HEADERS (extra safe)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// 🔥 ROUTES
app.use("/api/user", userRouter);
app.use("/api/D_owner", D_ownerRouter);

// 🔥 TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 🔥 START SERVER
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});