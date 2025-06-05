import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import CheckAuth from "../middlewares/checkAuth.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export default class UserRoute {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.get("/users", asyncHandler(UserController.getAllUsers));
        this.router.get("/users/:id", CheckAuth.checkAuth, asyncHandler(UserController.getUserById));
        this.router.post("/users", asyncHandler(UserController.createUser));
        this.router.put("/users/:id", CheckAuth.checkAuth, asyncHandler(UserController.updateUser));
        this.router.delete("/users/:id", CheckAuth.checkAuth, asyncHandler(UserController.deleteUser));
    }

    getRouter() {
        return this.router;
    }
}