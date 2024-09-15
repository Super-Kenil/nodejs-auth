import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/dbconfig.js";
import Session from "./sessions.model.js";

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  email: string;
  name: string;
  password: string;
  created_at?: CreationOptional<Date>;
  updated_at?: CreationOptional<Date>;
  deleted_at?: CreationOptional<Date>;
}

export const User = db.define<UserModel>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    modelName: 'User',
    tableName: "users",
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
)

User.hasMany(Session, {
  foreignKey: 'user_id',
  constraints: false,
  scope: {
    loginable_type: 'user'
  }
})

await User.sync({ force: false });

export default User;
