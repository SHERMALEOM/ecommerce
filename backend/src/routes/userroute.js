import express from "express";
import { register,login,logout,getProfile } from "../controler/usercontrol.js";
import  authMiddleware from "../middleware/authmiddleware.js";
const userRouter = express.Router();

 userRouter .post("/register", register);

userRouter.post("/login",login);

userRouter.post("/logout",authMiddleware, logout);

userRouter.get("/profile", authMiddleware, getProfile);

export default userRouter;