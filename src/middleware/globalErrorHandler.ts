import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import config from "../config";

const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources: [
      {
        path: "",
        message: err?.message,
      },
    ],
    stack: config.nodeENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
