import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userroute.js";
import productRouter from "./routes/productroute.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import redisClient from "./config/redis.js";
import connectDB from "./config/db.js";
import cartRouter from "./routes/cartroute.js";
import orderRouter from "./routes/orderroute.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
console.log("DB_KEY:", process.env.DB_KEY);
const serverr = express();

serverr.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
serverr.use(cookieParser());
serverr.use(express.json());


serverr.use("/user", userRouter);
serverr.use("/product", productRouter);
serverr.use("/cart", cartRouter)
serverr.use("/order", orderRouter)


const InitalizeConnection = async () => {
    try {

        await connectDB();
        console.log("DB Connected");

        serverr.listen(process.env.PORT_NUMBER, () => {
            console.log("Server listening at port number: " + process.env.PORT_NUMBER);
        });

    } catch (err) {
        console.log("Error: " + err);
    }
}

InitalizeConnection();