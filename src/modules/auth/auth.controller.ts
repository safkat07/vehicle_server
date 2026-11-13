import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { auth_services } from "./auth.services";
import sendResponse from "../../utils/sendResponse";

const login_user = catchAsync(async (req: Request, res: Response) => {
  const result = await auth_services.loginUser(
    req.body.email,
    req.body.password,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Login Successfull",
    data: result,
  });
});

export const auth_controller = {
  login_user,
};
