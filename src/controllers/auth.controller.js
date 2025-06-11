import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";
import AuthService from "../services/auth.service.js";

export default class AuthController {
  static register = async (req, res) => {
    try {
      const { fullname, address, email, password, gender, phone, age } =
        req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        fullname,
        address,
        email,
        password: hashedPassword,
        gender,
        phone,
        age,
      });

      await user.save();

      return res.status(201).json({
        message: "User registered successfully",
        data: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering user", error: error.message });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { algorithm: "HS256", expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key",
        { algorithm: "HS256", expiresIn: "1y" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", //prevent cross-site request forgery attacks
        maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
      });

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        accessToken,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in", error: error.message });
    }
  };

  static logout = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "You didnt signed in bitch!" });
    }
    res.clearCookie("refreshToken");
    res.json({ message: "Logout successful" });
  };

  static refreshToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }

      // xác thực refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
      );

      // tìm user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // tạo access token mới
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { algorithm: "HS256", expiresIn: "15m" }
      );

      res.json({
        message: "Token refreshed successfully",
        accessToken,
      });
    } catch (error) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(401)
          .json({ message: "Invalid or expired refresh token" });
      }
      res
        .status(500)
        .json({ message: "Error refreshing token", error: error.message });
    }
  };

  static getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      res.json(user);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error getting user", error: error.message });
    }
  };

  static async getUserById(req, res) {
    try {
      const user = await AuthService.getUserById(req.params.userId);
      return res.status(200).json({
        message: "Get user successfully",
        data: user,
      });
    } catch (error) {
      return res.status(404).json({
        message: "User not found",
        error: error.message,
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async resetPassword(req, res) {
    try {
      const { email, passwordResetToken, newPassword } = req.body;
      const result = await AuthService.resetPassword(
        email,
        passwordResetToken,
        newPassword
      );

      if (result.success) {
        return res.status(200).json({ message: result.message });
      } else {
        return res.status(400).json({ message: result.message });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
