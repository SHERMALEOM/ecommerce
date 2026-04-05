import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import redisClient from "../config/redis.js" ;

// import userRouter from "../routes/userroute";

 export const register = async (req,res)=>{
    try{
    const {firstname,email,password}=req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user=await User.create({
        firstname,
        email,
        password: hashedPassword,
    })
     const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )

    res.cookie("token",token,{ maxAge:24*60*60*1000})
    res.status(201).json({ success: true, message: "registration done successfully" })

    }

    catch(err){
        res.status(400).json({ success: false, message: "ERROR IS " + err })
    }
}

export const login = async (req,res)=>{
    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign(
            {id:user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:24*60*60*1000
        });

        res.status(200).json({ success: true, message: "Login successful", user: { id: user._id, firstname: user.firstname, email: user.email, role: user.role } });

    }
    catch(err){
        res.status(400).json({ success: false, message: "ERROR IS " + err });
    }
}

export const logout = async (req,res)=>{
    try{

        const token = req.cookies.token;

        if(!token){
            return res.status(400).json({ success: false, message: "No token found" });
        }

        // store token in redis blacklist
        await redisClient.set(token,"logout");

        res.clearCookie("token");

        res.status(200).json({ success: true, message: "Logout successful" });

    }
    catch(err){
        res.status(400).json({ success: false, message: "ERROR IS " + err });
    }
}

export const getProfile = async (req, res) => {
  try {

    res.status(200).json({
      success: true,
      user: req.user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

