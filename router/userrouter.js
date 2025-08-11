 import { Router } from "express";
  import { userRegister, login, Userprofile } from "../controllers/userController.js";
 const UserRouter = Router();

 UserRouter.route('/register').post(userRegister);
UserRouter.route('/login').get(login);
UserRouter.route('/Userprofile/:userid').get(Userprofile);


 export default UserRouter;
