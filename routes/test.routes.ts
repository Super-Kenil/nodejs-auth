//main
import express from "express";


//controllers
import { authController } from "../controllers/auth.controller.js";
import Session from "../models/sessions.model.js";
import User from "../models/users.model.js";

import axios from "axios";

// variables
const testRouter = express.Router();

const BASE_URL = 'http://localhost:8000/api/v1'


testRouter.get('/', async (req, res) => {
  try {
    const data = (await axios.post(`${BASE_URL}/users`, {}))
  } catch (err) {
    if (err instanceof Error) {
      res.send(err.message);
    }
  }
  res.send("data.data");
});

testRouter.delete('/', async (req, res) => {
  try {
    const sessionsCleared = (await Session.destroy({ where: {}, force: true }))
    const usersCleared = (await User.destroy({ where: {}, force: true }))

    if (!usersCleared && !sessionsCleared) {
      return res.status(500).json({
        status: false,
        message: "Error Clearing Test Records from Database",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Test Records cleared from Database",
    });

  } catch (err) {
    if (err instanceof Error) {
      res.send(err.message);
    }
  }
})



export default testRouter;
