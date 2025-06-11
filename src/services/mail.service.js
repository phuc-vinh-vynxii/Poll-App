import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file
const mailService = {
  async sendEmail({ emailFrom, emailTo, emailSubject, emailText }) {
    if (!emailTo) throw new Error("No recipient email (emailTo) provided");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: emailSubject,
      text: emailText,
    });
  },
};

Object.freeze(mailService);

export default mailService;
