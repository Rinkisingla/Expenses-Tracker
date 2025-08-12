import {Router} from "express"
const expenseRouter = Router();
 import{editexpense, addexpense, deleteExpenseSchema,FilteringExpenses, Summary} from '../controllers/expenseController.js'
import { verifyjwt } from "../middleware/authmiddleware.js";

expenseRouter.route('/addexpense').post(verifyjwt,addexpense);
expenseRouter.route('/editexpense/:id').patch(verifyjwt,editexpense);
expenseRouter.route('/deleteExpenseSchema/:id').delete(verifyjwt,deleteExpenseSchema);
expenseRouter.route('/FilteringExpenses').get(verifyjwt,FilteringExpenses);
expenseRouter.route('/Summary').get(verifyjwt,Summary);


 export default expenseRouter;
