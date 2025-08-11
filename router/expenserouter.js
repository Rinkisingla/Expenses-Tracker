import {Router} from "express"
const expenseRouter = Router();
 import{addexpense} from '../controllers/expenseController.js'
import { verifyjwt } from "../middleware/authmiddleware.js";

expenseRouter.route('/addexpense').post(verifyjwt,addexpense);
 export default expenseRouter;
