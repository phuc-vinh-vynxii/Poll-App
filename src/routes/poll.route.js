import { Router } from "express";
import PollController from "../controllers/poll.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import CheckAuth from "../middlewares/checkAuth.js";

class PollRoute {
  constructor() {
    this.router = Router();
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post("/polls", CheckAuth.checkAuth, asyncHandler(PollController.createPoll));
    this.router.get("/polls", asyncHandler(PollController.getAllPolls));
    this.router.get("/polls/:id", asyncHandler(PollController.getPollById));
    this.router.post("/polls/:pollId/options", asyncHandler(PollController.addOption));
    this.router.delete("/polls/:pollId/options/:optionId", asyncHandler(PollController.removeOption));
    this.router.post("/polls/:pollId/lock", asyncHandler(PollController.lockPoll));
    this.router.post("/polls/:pollId/unlock", asyncHandler(PollController.unlockPoll));
  }

  getRouter() {
    return this.router;
  }
}

export default PollRoute;
