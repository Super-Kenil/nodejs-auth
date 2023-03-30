// main
import { Joi } from "express-validation";
import bcrypt from "bcrypt";
import { Sequelize } from "sequelize";
import _ from "lodash";



// Models
import Users from "../models/users.model.js"
import Sessions from "../models/sessions.model.js"

// helpers
import { GenerateAToken } from "../helpers/tokenGenerator.js";

// variables
const Op = Sequelize.Op


export const userController = {
  registerUser,
}

async function registerUser(req, res) {

  try {
    const validateSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .required()
        .messages({
          "string.pattern.base":
            "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special case character.",
        }),
      device_info: Joi.string().required(),
    });

    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return res.status(403).json({
        status: false,
        message: validate.error.details[0].message,
      });
    }

    const user = await Users.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).json({
        status: false,
        message: "User already exists.",
      });
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: err.message
        });
      };

      req.body.pasword = hash;
      const userCreateResult = await Users.create({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
      })

      if (!userCreateResult) {
        return res.status(400).json({
          status: false,
          message: 'Error creating user',
        })
      }

      const date = new Date();
      date.setDate(date.getDate() + 30)

      const session = await Sessions.create({
        user_id: userCreateResult.id,
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

      const userResponse = _.omit(userCreateResult.dataValues, ['password', 'created_at', 'updated_at'])
      const sessionResponse = _.omit(session.dataValues, ['created_at', 'last_access_at', 'updated_at',])

      return res.status(200).json({
        status: true,
        message: "User Registered Successfully!",
        data: { userResponse, sessionResponse },
      });
    })

  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err.message,
    })
  }
}