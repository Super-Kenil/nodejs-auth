// main
import { Request, Response } from 'express';
import { Joi } from "express-validation";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import _ from "lodash";



// Models
import User from "../models/users.model.js"
import Session from "../models/sessions.model.js"

// helpers
import { GenerateAToken } from "../helpers/token_generator.js";
import { getFutureDate } from "../helpers/date_generator.js";

// variables

export const authController = {
  registerUser,
  loginUser,
  getMyAllSessions,
  logoutUserItself,
  logoutUserSession,
}

interface IUser {
  id?: number;
  email: string;
  name?: string;
  password?: string;
}

async function registerUser(req: Request, res: Response) {

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

    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(409).json({
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
      const userCreateResult = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: hash,
      })

      if (!userCreateResult) {
        return res.status(500).json({
          status: false,
          message: 'Error creating user',
        })
      }

      const date = new Date();
      date.setDate(date.getDate() + 30)

      const session = await Session.create({
        user_id: userCreateResult.id,
        device_info: req.body.device_info,
        token: await GenerateAToken(),
        expires_at: date,
        last_access_at: new Date(),
      })

      if (!session) {
        return res.status(500).json({
          status: false,
          message: 'Error Creating Session',
        });
      };

      const userResponse = _.omit(userCreateResult.dataValues, ['password', 'created_at', 'updated_at', 'deleted_at'])
      const sessionResponse = _.omit(session.dataValues, ['created_at', 'last_access_at', 'updated_at',])

      return res.status(200).json({
        status: true,
        message: "User Registered Successfully!",
        data: { userResponse, sessionResponse },
      });
    })

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      })
    }
  }
}

async function loginUser(req: Request, res: Response) {
  try {

    const validateSchema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
        .required()
        .messages({
          "string.pattern.base":
            "Incorrect Password",
        }),
      device_info: Joi.string().required(),
    })

    const validate = validateSchema.validate(req.body);
    if (validate.error) {
      return res.status(403).json({
        status: false,
        message: validate.error.details[0].message,
      });
    }

    const user = await User.findOne({ where: { email: req.body.email }, attributes: ['id', 'email', 'password'] })

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: 'Invalid credentials'
      });
    }

    const session = await Session.create({
      user_id: user.id,
      device_info: req.body.device_info,
      token: await GenerateAToken(),
      expires_at: await getFutureDate(30),
      last_access_at: new Date(),
    })

    if (!session) {
      return res.status(500).json({
        status: false,
        message: "Error Creating Session",
      });
    };

    // const userResponse = _.omit(user.dataValues, ['password', 'created_at', 'updated_at', 'deleted_at'])
    const sessionResponse = _.omit(session.dataValues, ['created_at', 'last_access_at', 'updated_at',])

    return res.status(200).json({
      status: true,
      message: "User Registered Successfully!",
      data: { user, sessionResponse },
    });

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      })
    }
  }
}

async function getMyAllSessions(req: Request, res: Response) {
  try {
    await Session.update(
      { last_access_at: new Date() },
      { where: { token: res.locals.token } },
    )
    const sessionsList = await Session.findAll({
      where: { user_id: res.locals.user.id }, attributes: ['id', 'device_info', 'last_access_at',]
    })

    return res.status(200).json({
      status: true,
      message: "Found all sessions!",
      data: { sessionsList },
    });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      })
    }
  }
}

async function logoutUserSession(req: Request, res: Response) {
  try {
    await Session.update(
      { last_access_at: new Date() },
      { where: { token: res.locals.token } },
    )
    const validateSchema = Joi.object().keys({
      id: Joi.number().required(),
    })
    const validate = validateSchema.validate(req.params)
    if (validate.error) {
      return res.status(403).json({
        status: false,
        message: validate.error.details[0].message,
      });
    }

    const sessionHasDeleted = await Session.destroy({
      where: {
        [Op.and]: [
          { user_id: res.locals.user.id },
          { id: req.params.id },
        ]
      }
    })

    if (!sessionHasDeleted) {
      return res.status(500).json({
        status: false,
        message: `Error Logging out ${req.params.id}`
      })
    }

    return res.status(200).json({
      status: true,
      message: `Session with id ${req.params.id} has been Logged out.`,
      data: { deletedID: req.params.id, },
    })

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      })
    }
  }
}

async function logoutUserItself(req: Request, res: Response) {
  try {

    const sessionDeleted = await Session.findOne({ where: { token: res.locals.token } })
    if (!sessionDeleted) {
      return res.status(500).json({
        status: false,
        message: "Error deleting session.",
      })
    }

    return res.status(200).json({
      status: true,
      message: 'Logged Out successfully!'
    })

  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({
        status: false,
        message: err.message,
      })
    }
  }
}
