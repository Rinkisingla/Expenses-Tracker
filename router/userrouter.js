 import { Router } from "express";
  import { userRegister, login } from "../controllers/userController.js";
 const UserRouter = Router();

 UserRouter.route('/register').post(userRegister);
UserRouter.route('/login').get(login);


 export default UserRouter;
