// main
import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

// routes
import userRouter from "./routes/users.routes.js";
import testRouter from "./routes/test.routes.js";

export const app: Application = express();

var corOptions = {
  origin: "*",
};

app.use(cors(corOptions));
app.use(morgan(process.env.NODE_SERVER === "DEVELOPMENT" ? "dev" : "tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/users", userRouter);
app.use('/api/v1/test', testRouter)
