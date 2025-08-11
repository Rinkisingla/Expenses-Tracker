import AsyncHandler from "../utilities/AsyncHandler.js";
import {expenseSchema } from "../validation/expense.schema.js";
import { Expenses } from "../models/expense.model.js";
import ApiError from "../utilities/ApiError.js";
import ApiRespose from "../utilities/ApiResponse.js";

 
 const addexpense = AsyncHandler(async(req, res)=>{
        const payload = {
            userId: req.user.id,   // from authenticated user
            ...req.body            // other fields from client
         };
        const result = expenseSchema.safeParse(payload);
        if (!result.success) {
        const messages = result.error.issues.map(err => err.message);
        throw new ApiError(400, messages.join(", ") || "Invalid input");
        }
    const {userId, title, amount, category, date} = result.data;
     const expensecheck = await Expenses.findOne(
        { $and:[{title},{amount}]});
     if(expensecheck){
         throw new ApiError( 401, "This expenses is already exists")
     }
    const expense =  await Expenses.create({userId, title, amount, category, date});
    
     const expensefind = await Expenses.findById(expense._id);
     if(!expensefind){
        throw new ApiError( 401, "there is error in creating the expense")
    }
      res.status(201).json(
         new ApiRespose(200,expensefind ,"expense was created successfully")
      );
     
 })
 const editexpese = AsyncHandler(async(req,res)=>{
     const{amount, date, categroy}= req.body

 })
  export {addexpense, editexpese}