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
    this.router.get("/", asyncHandler(UserController.getAllUsers));
    this.router.get(
      "/:id",
      CheckAuth.checkAuth,
      asyncHandler(UserController.getUserById)
    );
    this.router.post("/", asyncHandler(UserController.createUser));
    this.router.put(
      "/:id",
      CheckAuth.checkAuth,
      asyncHandler(UserController.updateUser)
    );
    this.router.delete(
      "/:id",
      CheckAuth.checkAuth,
      asyncHandler(UserController.deleteUser)
    );
  }

  getRouter() {
    return this.router;
  }
}
