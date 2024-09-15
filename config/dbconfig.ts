import dotenv from "dotenv";
dotenv.config({ path: `.env${process.env.NODE_ENV? process.env.NODE_ENV: ''}` })
import { Sequelize } from "sequelize";

const db = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD,
  {
    port: Number(process.env.DB_PORT),
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

db.authenticate()
  .then(() => {
    console.log("Connected...");
  })
  .catch((error) => {
    console.log("Error", error);
  });

export default db;
