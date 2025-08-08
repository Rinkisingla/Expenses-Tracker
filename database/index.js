  import mongoose from "mongoose";
 const connectdb= async()=>{
     try {
         const connectionString =  await mongoose.connect(`${process.env.Mongodburl}/ ${process.env.Db_Name}`)
        console.log("connection string", connectionString.connection.host);
     } catch (error) {
        console.log("MongoDb connection ERROR", error);
     }

 }
 export  default connectdb