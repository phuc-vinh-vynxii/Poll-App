import AuthRoute from "./auth.route.js";
import PollRoute from "./poll.route.js";
import VoteRoute from "./vote.route.js";
import UserRoute from "./user.route.js";

export default (app) => {
  try {
    const authRoute = new AuthRoute();
    const pollRoute = new PollRoute();
    const voteRoute = new VoteRoute();
    const userRoute = new UserRoute();

    // Mount routes with proper prefixes
    app.use("/api/v1/auth", authRoute.getRouter());
    app.use("/api/v1/polls", pollRoute.getRouter());
    app.use("/api/v1/votes", voteRoute.getRouter());
    app.use("/api/v1/users", userRoute.getRouter());

    console.log("Routes mounted successfully");
  } catch (error) {
    console.error("Error mounting routes:", error);
  }
};
