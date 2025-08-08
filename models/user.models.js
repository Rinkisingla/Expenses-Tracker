 import mongoose, {Schema} from "mongoose";
 import bcrypt from "bcrypt";
 import jwt from "jsonwebtoken"
  const userSchema =  new Schema({
      username:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
      },
      fullname:{
        type: String,
        required:true,
      },
      email:{
        type: String,
        required:true,
        unique:true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email']
      },
      password:{
        type: String,
        required:true,
      },
      refreshToken:{
        type: String,
      }


  }, {
    timestamps:true,
  })
   userSchema.pre("save",async function (next) {
     if(!this.isModified("password")){return next();}
     const salt = await bcrypt.genSalt(10);
     this.password  = await bcrypt.hash(this.password, salt);
     next();
    
   })
    userSchema.methods.ispasswordvalid = async function(password) {
     return await bcrypt.compare(password, this.password);
    }
     userSchema.methods.generateaccesstoken =  function() {
        return jwt.sign(
            {
                id: this._id,
                fullname:this.fullname,
                username:this.username,
                email:this.email,
            },
            process.env.ACCESS_TOKEN_SECRETKEY,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRESIN
            }
        )
        
     }
      userSchema.methods.generaterefreshtoken =  function() {
        return jwt.sign(
            {
                id: this._id,
                
            },
            process.env.REFRESH_TOKEN_SECRETKEY,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRESIN
            }
        )
        
     }
   export const User =  mongoose.model("User", userSchema);