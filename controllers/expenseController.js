import AsyncHandler from "../utilities/AsyncHandler.js";
import {expenseSchema , editExpenseSchema} from "../validation/expense.schema.js";
import { Expenses } from "../models/expense.model.js";
import ApiError from "../utilities/ApiError.js";
import ApiRespose from "../utilities/ApiResponse.js";
import mongoose from "mongoose";

 
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
 const editexpense = AsyncHandler(async(req,res)=>{
      const {id}= req.params;
        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(409, "GIVE THE VALID ID TO UPDATE");
        }
      const result= editExpenseSchema.safeParse(req.body);
       if(!result.success){
         const message= result.error.issues.map(err=>err.message);
          throw new ApiError(400, message.join(", ") || "fields required");
       }
    const expense= await Expenses.findByIdAndUpdate(id,result.data,{new:true});
     if(!expense){
         throw new ApiError(400,"error in updating the data");
     }
     
    res.status(201).json(new ApiRespose(201, expense, "data is fetched successfully"));
 })
  const deleteExpenseSchema= AsyncHandler(async(req, res)=>{
        const {id}= req.params;
        if (!mongoose.isValidObjectId(id)) {
            throw new ApiError(409, "Give the valid id to delete");
        }
         const deleteExpense = await Expenses.findByIdAndDelete(id);
         if(!deleteExpense){
             throw new ApiError(402, "errorin delete the schema");
            }
            res.status(201).json( new ApiRespose(201, deleteExpense,"Expenses was delete successfully"));
         
  })
   const FilteringExpenses = AsyncHandler(async(req,res)=>{
     const {category,from,to} =req.query
        const fromDate = new Date(`${from}T00:00:00+05:30`);
    const toDate   = new Date(`${to}T23:59:59.999+05:30`);

    // Log in IST
    console.log("From Date (IST):", fromDate);
    console.log("To Date   (IST):", toDate);


    const cdata = await Expenses.aggregate(
        [
          {
          $match:{category:category,date: { $gte: fromDate, $lte:toDate }}
          },
          {
          $group:{_id:null, totalamount:{$sum:"$amount"}, totalexpense:{$sum:1},
          Expense:{$push :"$$ROOT"}
          }
          }

        ]);
     res.status(201).json( new ApiRespose( 201, cdata ,"category data"))
   })

   const Summary= AsyncHandler(async(req,res)=>{
    const month= req.query.month;
    const year= req.query.year;
    
   const data = await Expenses.aggregate([
  {
    $match: {
      $expr: {
        $and: [
          { $eq: [{ $month: "$date" }, Number(month)] },
          { $eq: [{ $year: "$date" }, Number(year)] }
        ]
      }
    }
  },
  {
    $facet: {
      summary: [
        {
          $group: {
            _id: {month: { $dateToString: { format: "%B", date: "$date" } }},
            
            totalAmount: { $sum: "$amount" },
            totalExpenses: { $sum: 1 }
          }
        }
      ],
      breakdown: [
        {
          $group: {
            _id: "$category",
            total: { $sum: "$amount" }
          }
        }
      ]
    }
  }
]);


    res.status(200).json( new ApiRespose( 200, data, "summary of this month"))

   })

   
  export {addexpense, editexpense, deleteExpenseSchema, FilteringExpenses, Summary}