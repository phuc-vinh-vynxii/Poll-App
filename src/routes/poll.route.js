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
    this.router.post(
      "/",
      CheckAuth.checkAuth,
      asyncHandler(PollController.createPoll)
    );
    this.router.get("/", asyncHandler(PollController.getAllPolls));
    this.router.get("/:id", asyncHandler(PollController.getPollById));
    this.router.post(
      "/:pollId/options",
      asyncHandler(PollController.addOption)
    );
    this.router.delete(
      "/:pollId/options/:optionId",
      asyncHandler(PollController.removeOption)
    );
    this.router.post("/:pollId/lock", asyncHandler(PollController.lockPoll));
    this.router.post(
      "/:pollId/unlock",
      asyncHandler(PollController.unlockPoll)
    );
  }

  getRouter() {
    return this.router;
  }
}

export default PollRoute;
