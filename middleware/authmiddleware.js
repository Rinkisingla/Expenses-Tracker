import jwt  from "jsonwebtoken";
import ApiError from "../utilities/ApiError.js";
import AsyncHandler from "../utilities/AsyncHandler.js";
import { User } from "../models/user.models.js";

    const verifyjwt = AsyncHandler(async(req, res, next)=>{
    try {
            const token = req.cookies?.accesstoken || req.header("Authorization")?.replace(/^Bearer\s+/i, "").trim();
            if(!token){
                throw new ApiError(404, "Token Notfound");
            }
             const verifytoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETKEY);
              if(!verifytoken){
                 throw new ApiError(403, "Invalid token");

              }
              const user =  await  User.findById(verifytoken.id).select("-password, -refreshToken")
           if(!user){
              throw new ApiError(400, "User not found");
           }
           req.user= user;
           next();

    } catch (error) {
        
         throw new ApiError(402,error?.message ||"invalid access token")
    }


    })
    export {verifyjwt}