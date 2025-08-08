 import express from "express"
 const app = express();
 import dotenv from "dotenv"
 import cookieParser from "cookie-parser";
 import connectdb from "./database/index.js"
  import UserRouter from "./router/userrouter.js"
 dotenv.config(),

connectdb();
 app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/app/user/v1', UserRouter);
  app.listen(process.env.PORT_NO , ()=>{
    console.log("working fine on this port");
  })

