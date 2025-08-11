import AsyncHandler from "../utilities/AsyncHandler.js";
import ApiError from "../utilities/ApiError.js"
 import { userSchema } from "../validation/user.schema.js";
 import ApiResponse from "../utilities/ApiResponse.js"
import { User } from "../models/user.models.js";

const generateaccessandrefreshtoken = async(userId)=>{
     try {
        const user =  await  User.findById(userId);
        const accessToken =  await user.generateaccesstoken();
        const refreshToken = await user.generaterefreshtoken();
       
        user.refreshToken= refreshToken;
        user.save({validateBeforeSave: false});
           return ({accessToken, refreshToken});
     } catch (error) {
         throw new ApiError (400,error);
     }
}
const userRegister= AsyncHandler(async(req, res)=>{
  const result = userSchema.safeParse(req.body);

if (!result.success) {
    const messages = result.error.issues.map(err => err.message);
    throw new ApiError(400, messages.join(", ") || "Invalid input");
  }

const { username, fullname, email, password } = result.data;
       const finduser = await User.findOne({username});
        if(finduser){
            throw new ApiError(403, "This user is already exist");
        } 
         const user = await User.create({username,fullname,email,password});
         const existinguser = await User.findById(user._id).select("-password");
          if(!existinguser){
            throw new  ApiError(403, "user is not created");
        } 
         res.status(201).json(
           new ApiResponse(201, existinguser, "User was created successfully")
         )
})
 const  login =  AsyncHandler(async(req,res)=>{
     const {email , password}=  req.body;
      if(!email ||!password){
         throw new ApiError(401, "email, password is required");
      }
    const user = await User.findOne({email});
     if(!user){
        throw new ApiError(404 , "this user does not exists");
     }
    const ispasswordvalid =  await user.ispasswordvalid(password);
    if(!ispasswordvalid){
        throw new ApiError(403 , "Invalid creditional");
     }
     const options={
        httponly:true,
        secure:true,
     }
     const{accessToken, refreshToken}=  await generateaccessandrefreshtoken(user._id);
    res.status(200).cookie("accesstoken", accessToken,options)
     .cookie("refreshtoken",refreshToken, options)
      .json( new ApiResponse(200,
          {user: user, accessToken, refreshToken},"loggedin user successfully"
      ))
  
 })
  const Userprofile =AsyncHandler(async(req, res)=>{
        const {userid}= req.params;
         if(!userid?.trim())
          throw new ApiError(402, "Invalid Input");
          const user = await User.findById(userid);
          if(!user){
             throw new ApiError(404, "User Not found");
          }
         res.status(200).json(
            new ApiResponse( 200, user, "User data fetched successfully")
         )
         

       })
 export {userRegister, login, Userprofile}