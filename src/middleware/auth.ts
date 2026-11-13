import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    //if no token
    if (!token) {
      throw new AppError(401, "Unauthorized: No Token Provided");
    }

    //
    try {
      const decoded = jwt.verify(token, config.jwtSecret as string);
      console.log({ decoded: decoded });
      req.user = decoded as JwtPayload;
      if (roles.length && !roles.includes(req.user.role)) {
        throw new AppError(403, "No Role is Matched");
      }
      next();
    } catch (err: any) {
      throw new AppError(403, "Forbidden: Insufficient Role");
    }
  };
};

export default auth;
