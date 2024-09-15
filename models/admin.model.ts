import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import db from "../config/dbconfig.js";
import Session from "./sessions.model.js";

interface AdminModel extends Model<InferAttributes<AdminModel>, InferCreationAttributes<AdminModel>> {
  id: CreationOptional<number>;
  email: string;
  name: string;
  password: string;
  created_at?: CreationOptional<Date>;
  updated_at?: CreationOptional<Date>;
  deleted_at?: CreationOptional<Date>;
}

export const Admin = db.define<AdminModel>(
  "Admin",
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
    modelName: "Admin",
    tableName: "admins",
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
)

Admin.hasMany(Session, {
  foreignKey: 'user_id',
  constraints: false,
  scope: {
    loginable_type: 'admin'
  }
});

Session.belongsTo(Admin, {
  foreignKey: 'user_id',
  constraints: false,
  as: 'loginable',
});

await Admin.sync({ force: false });

export default Admin;
