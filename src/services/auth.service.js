import User from "../models/user.model.js";
import { NotFoundError } from "../handlers/error.response.js";
import crypto from "crypto";
import sendMail from "../utils/sendMail.js";
import mailService from "../services/mail.service.js";

export default class AuthService {
  static async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found", 404);
    }
    return user;
  }
  static async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new NotFoundError("User not found", 404);
      }

      const secretKey = crypto.randomBytes(32).toString("hex");
      const passwordResetToken = crypto
        .createHash("sha256")
        .update(secretKey)
        .digest("hex");
      const passwordResetExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpiration = passwordResetExpiration;
      const updateStatus = await user.save();
      if (!updateStatus) {
        throw new NotFoundError("User not found", 404);
      }

      await mailService.sendEmail({
        emailFrom: "admin@gmail.com",
        emailTo: email,
        emailSubject: "Password Reset",
        emailText: `Here is your password reset token: ${passwordResetToken}`, // gửi raw token, không hash
      });

      return {
        status: 200,
        success: true,
        message: "Reset email sent",
      };
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw error;
    }
  }

  static async resetPassword(email, passwordResetToken, newPassword) {
    try {
      const user = await User.findOne({
        email: email,
        passwordResetToken: passwordResetToken,
        passwordResetExpiration: { $gt: Date.now() },
      });

      if (!user) {
        return {
          success: false,
          message: "Invalid token or password reset token has expired",
        };
      }

      // const salt = crypto.randomBytes(32).toString("hex");
      // const hashedPassword = crypto.pbkdf2Sync(newPassword, salt, 10, 64, "sha512").toString("hex");
      const hashedPassword = crypto
        .createHash("sha256")
        .update(newPassword)
        .digest("hex");

      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpiration = null;
      const updateStatus = await user.save();

      if (updateStatus) {
        return {
          success: true,
          message: "Password reset successfully",
        };
      } else {
        return {
          success: false,
          message: "Failed to reset password",
        };
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  }
}
