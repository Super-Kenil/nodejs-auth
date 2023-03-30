// main
import { } from "dotenv/config";
import jwt from "jsonwebtoken";

// models
import Users from "../models/users.model.js";
import Sessions from "../models/sessions.model.js";


// User Login
export const loginUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        status: false,
        message: 'Access denied! No Token Provided',
      })
    }

    const session = await Sessions.findOne({ where: { token: req.body.token } })

    if (!session) {
      return res.status(401).json({
        status: false,
        message: 'Invalid or Expired Token',
      })
    }



  } catch (err) {

  }
}