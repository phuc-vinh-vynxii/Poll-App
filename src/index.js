import express from "express";
import dotenv from "dotenv";
import {errorHandler} from "./handlers/error-handler.js";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.route.js";

dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
router(app);
app.use('*', (req, res) => {
    res.status(404).json({
        error: "NOT FOUND",
    });
});
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
