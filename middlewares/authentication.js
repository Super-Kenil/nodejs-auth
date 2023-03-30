

// models
import Users from "../models/users.model.js";
import Sessions from "../models/sessions.model.js";

// User Login
export const loginUser = async (req, res, next) => {
  try {
    const user = await Sessions.findOne({where: {}})
  } catch (err) {

  }
}