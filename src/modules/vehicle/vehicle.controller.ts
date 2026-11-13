import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { vehicle_sevices } from "./vehicle.services";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../utils/AppError";

const create_vehicle = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const vehiclePayload = {
    ...req.body,
    added_by: userId,
  };
  const result = await vehicle_sevices.add_vehicle_db(vehiclePayload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Vehicle Added",
    data: result.rows[0],
  });
});
const get_vehicles = catchAsync(async (req: Request, res: Response) => {
  const result = await vehicle_sevices.get_all_vehicles_db();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All vehicle Information retrived",
    data: result.rows,
  });
});
const get_vehicle_by_id = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await vehicle_sevices.get_single_vehicle(id as string);
  if (result.rows.length === 0) {
    throw new AppError(404, "Vehicles not found");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle fetched successfully",
    data: result.rows[0],
  });
});
const update_vehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const uData = req.body;
  const result = await vehicle_sevices.update_vehicle_db(id as string, uData);
  if (result.rows.length === 0) {
    throw new AppError(404, "Vehicle not found for update!");
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle updated successfully",
    data: result.rows[0],
  });
});
const delete_vehicle = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await vehicle_sevices.delete_vehicle_db(id as string);
  // console.log({resullength: result.rows.length})
  if (result.rows.length === 0) {
    throw new AppError(404, "Vehicle Not found");
  }
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Vehicle Deleted successfully",
  });
});

export const vehicle_controller = {
  create_vehicle,
  get_vehicles,
  get_vehicle_by_id,
  update_vehicle,
  delete_vehicle,
};
