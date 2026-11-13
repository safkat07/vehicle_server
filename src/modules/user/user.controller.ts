import { Request, Response } from "express";
import { user_services } from "./user.services";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const { create_user_DB, get_user_DB } = user_services;

const create_user = catchAsync(async (req: Request, res: Response) => {
  const result = await create_user_DB(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User Created Successfully",
    data: result.rows[0],
  });
});

const get_user = catchAsync(async (req: Request, res: Response) => {
  const result = await get_user_DB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Retrived Successfully",
    data: result.rows,
  });
});

export const user_controller = {
  create_user,
  get_user,
};
