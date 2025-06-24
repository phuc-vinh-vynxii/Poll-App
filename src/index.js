import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { errorHandler } from "./handlers/error-handler.js";
import instanceMongoDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.route.js";
import methodOverride from "method-override";
import path from "path";

const app = express();
dotenv.config();
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
// instanceMongoDB.connect();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add a simple test route first
app.get("/", (req, res) => {
  res.json({ message: "Poll API is running test CI/CD! hahahaha" });
});

router(app);
app.use("*", (req, res) => {
  res.status(404).json({
    error: "NOT FOUND",
  });
});
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
