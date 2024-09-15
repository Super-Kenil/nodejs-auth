//main
import express from "express";


//controllers
import { authController } from "../controllers/auth.controller.js";
import { verifyUserToken } from "../middlewares/authentication.js";

// variables
const userRouter = express.Router();

// endpoints

userRouter.get('/', verifyUserToken, authController.getMyAllSessions)


userRouter.post('/', authController.registerUser);
userRouter.post('/login', authController.loginUser);


userRouter.delete('/', verifyUserToken, authController.logoutUserItself)
userRouter.delete('/:id', verifyUserToken, authController.logoutUserSession)



export default userRouter;
