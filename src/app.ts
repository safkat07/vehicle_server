import express, { Request, Response } from "express";
import initDB from "./config/db";
import { user_router } from "./modules/user/user.routes";
import { auth_router } from "./modules/auth/auth.routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { vehicle_router } from "./modules/vehicle/vehicle.routes";

const app = express();
app.use(express.json());
initDB();
app.get("/", (req: Request, res: Response) => {
  res.send("Vehicle Rental Server is running");
});

app.use("/api/v1", user_router);
app.use("/api/v1", auth_router);
app.use("/api/v1", vehicle_router);

app.use("/", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
    path: req.path,
  });
});

app.use(globalErrorHandler);
export default app;
