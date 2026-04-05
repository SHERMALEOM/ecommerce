import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

 const authMiddleware = async (req,res,next)=>{

    const token = req.cookies.token;

    if(!token){
        return res.status(401).send("Unauthorized");
    }
    

    const isBlacklisted = await redisClient.get(token);

    if(isBlacklisted){
        return res.status(401).send("Token expired");
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    req.user = decoded;

    next();
}

export default authMiddleware



