import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

class CheckAuth {
  static checkAuth = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }
      const token = authHeader.split(" ")[1];
      console.log("Token received:", token);

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      console.log("Token decoded:", decoded);

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.log("Auth error:", error.message);
      return res
        .status(401)
        .json({ message: "Unauthorized", error: error.message });
    }
  };
}

export default CheckAuth;
