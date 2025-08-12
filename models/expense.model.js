 import mongoose, {Schema} from "mongoose";
const expensesSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type: String,
        required:true,
      },
    amount:{
        type:Number,
        required:true,
         min: [1, "Amount must be greater than 0"]
    },
    category:{
        type:String,
        enum:["food", "clothes", "transport", "rent"],
        required:true,
    },
    date:{
        type:Date,
        default:Date(),
        required:true,
    }

}) 
export const Expenses = mongoose.model("Expenses", expensesSchema);