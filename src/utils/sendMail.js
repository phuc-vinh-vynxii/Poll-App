import transporter from "../config/mailer.config.js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const sendMail = async ({ emailFrom, emailTo, emailSubject, emailText }) => {
  await transporter.sendMail({
    from: emailFrom,
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  });
};

export default sendMail;
