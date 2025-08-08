// validation/user.schema.js
import { z } from "zod";

export const userSchema = z.object({
  fullname: z.string().min(3, "Name must be at least 3 characters long"),
  username: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  
});
