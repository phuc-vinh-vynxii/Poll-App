import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import CheckAuth from "../middlewares/checkAuth.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import AuthService from "../services/user.service.js";

class AuthRoute {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/auth/register", AuthController.register);
    this.router.post("/auth/login", AuthController.login);
    this.router.post("/auth/processNewToken", AuthController.refreshToken);
    this.router.delete("/auth/logout", AuthController.logout);
    this.router.get("/users/me", CheckAuth.checkAuth, AuthController.getMe);
    this.router.get("/users/:userId", asyncHandler(AuthController.getUserById));
    // this.router.post("/auth/forgot-password", validateEmail, AuthController.forgotPassword);
    this.router.post("/auth/reset-password", AuthController.resetPassword);
  }

  getRouter() {
    return this.router;
  }
}

export default AuthRoute;
