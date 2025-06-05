import { Router } from "express";
import VoteController from "../controllers/vote.controller.js";
import CheckAuth from "../middlewares/checkAuth.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export default class VoteRoute {
    constructor() {
        this.router = Router();
        this.setupRoutes();
    }

    setupRoutes() {
        this.router.post("/votes", CheckAuth.checkAuth, asyncHandler(VoteController.createVote));
        this.router.delete("/votes", CheckAuth.checkAuth, asyncHandler(VoteController.deleteVote));
    }

    getRouter() {
        return this.router;
    }
}