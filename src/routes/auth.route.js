import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import CheckAuth from "../middlewares/checkAuth.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AuthService from "../services/auth.service.js";

class AuthRoute {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/register", AuthController.register);
    this.router.post("/login", AuthController.login);
    this.router.post("/refresh-token", AuthController.refreshToken); // Changed from processNewToken
    this.router.delete("/logout", AuthController.logout);
    this.router.get("/me", CheckAuth.checkAuth, AuthController.getMe);
    this.router.get("/users/:userId", asyncHandler(AuthController.getUserById));
    this.router.post("/forgot-password", AuthController.forgotPassword);
    this.router.post("/reset-password", AuthController.resetPassword);
  }

  getRouter() {
    return this.router;
  }
}

export default AuthRoute;
