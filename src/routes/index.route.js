import AuthRoute from "./auth.route.js";
import PollRoute from "./poll.route.js";
import VoteRoute from "./vote.route.js";
import UserRoute from "./user.route.js";

export default (app) => {
  const authRoute = new AuthRoute();
  const pollRoute = new PollRoute();
  const voteRoute = new VoteRoute();
  const userRoute = new UserRoute();
  app.use("/api/v1", authRoute.getRouter());
  app.use("/api", pollRoute.getRouter());
  app.use("/api", voteRoute.getRouter());
  app.use("/api", userRoute.getRouter());
};
