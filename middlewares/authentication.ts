// main
// import dotenv from "dotenv";
// dotenv.config()
import { Request, Response, NextFunction } from 'express';


// models
import Users from "../models/users.model.js";
import Sessions from "../models/sessions.model.js";

export const verifyUserToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        status: false,
        message: 'Access Denied! Invalid or Expired token.',
      });
    }
    const user = await Users.findOne({ where: { id: (await Sessions.findOne({ where: { token } }))?.user_id } })

    if (!user) {
      return res.status(404).json({
        status: false,
        message: 'User not found',
      })
    }
    res.locals.user = user;
    res.locals.token = token;
    // req.user = user;
    // req.token = token;
    next();

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      });
    }
  }
}
