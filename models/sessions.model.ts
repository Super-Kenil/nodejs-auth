import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/dbconfig.js";

// models
import User from "./users.model.js"

interface SessionModel extends Model<InferAttributes<SessionModel>, InferCreationAttributes<SessionModel>> {
  id: CreationOptional<number>;
  user_id: number;
  loginable_type: string;
  device_info: string;
  token: string;
  expires_at: Date;
  last_access_at: Date;
  created_at?: CreationOptional<Date>;
  updated_at?: CreationOptional<Date>;
  deleted_at?: CreationOptional<Date>;
}

const Session = db.define<SessionModel>(
  'Session',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    loginable_type: {
      type: DataTypes.STRING(100),

    },
    device_info: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    last_access_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    modelName: 'Session',
    tableName: 'sessions',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
)

Session.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'LoggedInBy',
  targetKey: 'id',
})

await Session.sync({ force: false });

export default Session;
