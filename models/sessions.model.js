import { DataTypes } from "sequelize";
import db from "../config/dbconfig.js";

// models
import Users from "./users.model.js";


const Sessions = db.define(
  'Sessions',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      }
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
    modelName: 'Sessions',
    tableName: 'Sessions',
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
)

Sessions.belongsTo(Users, {
  as: 'LoggedInBy',
  foreignKey: 'user_id',
  targetKey: 'id',
})

await Sessions.sync({ force: false });

export default Sessions;