//main
import express from "express";


//controllers
import { userController } from "../controllers/users.controller.js";

// variables
const userRouter = express.Router();


userRouter.post('/', userController.registerUser);


export default userRouter;