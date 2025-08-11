import { z } from "zod";
import mongoose from "mongoose";

export const expenseSchema = z.object({
  userId: z.string()
    .refine(id => mongoose.isValidObjectId(id), {
      message: "Invalid userId"
    }),

  title: z.string()
    .trim()
    .min(1, { message: "Title is required" }),

  amount: z.number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number"
    })
    .min(1, { message: "Amount must be greater than 0" }),

  category: z.enum(["food", "clothes", "transport", "rent"], {
    required_error: "Category is required",
    invalid_type_error: "Category must be one of: food, clothes, transport, rent"
  }),

  date: z.preprocess((val) => {
    // Allow date as string or Date object
    if (typeof val === "string" || val instanceof Date) {
      return new Date(val);
    }
    return val;
  }, z.date({ invalid_type_error: "Invalid date" }).optional())
});
