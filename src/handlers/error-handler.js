import { StatusCodes, ReasonPhrases } from "http-status-codes"; // Fixed import

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
