// main
import { Joi } from "express-validation";


// Models
import Users from "../models/users.model.js"
import Sessions from "../models/sessions.model.js"

// helpers
import { GenerateAToken } from "../helpers/tokenGenerator.js";

// variables

export const userController = {
  registerUser,
}

async function registerUser(req, res) {

  try {
    const validateSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
      device_info: Joi.string().required(),
    });

    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return res.status(403).json({
        status: false,
        message: validate.error.details[0].message,
      });
    }

    const user = await Users.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    })

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Error creating user',
      })
    }

    const date = new Date();
    date.setDate(date.getDate() + 30)

    const session = await Sessions.create({
      user_id: user.id,
      device_info: req.body.device_info,
      token: await GenerateAToken(),
      expires_at: date,
      last_access_at: new Date(),
    })

    if (!session) {
      return res.status(400).json({
        status: false,
        message: 'Error Generating token',
      })
    }

    return res.status(200).json({
      status: true,
      message: "User Registered Successfully!",
      data: { user, session },
    });

  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    })
  }
}