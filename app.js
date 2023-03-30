// main
import { } from "dotenv/config";
import express from "express";
import cors from "cors";
const app = express();

//configurations

// routes
import userRouter from "./routes/users.routes.js";

var corOptions = {
  origin: "*",
};

app.use(cors(corOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/v1/users", userRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, console.log(`Server is listening at ${PORT}`))