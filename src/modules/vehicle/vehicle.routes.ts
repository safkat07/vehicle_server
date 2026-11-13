import { Router } from "express";
import auth from "../../middleware/auth";
import { vehicle_controller } from "./vehicle.controller";

const router = Router();
const {
  create_vehicle,
  get_vehicles,
  get_vehicle_by_id,
  update_vehicle,
  delete_vehicle,
} = vehicle_controller;
router.post("/vehicles", auth("admin"), create_vehicle);
router.get("/vehicles", get_vehicles);
router.get("/vehicles/:id", get_vehicle_by_id);
router.patch("/vehicles/:id", auth("admin"), update_vehicle);
router.delete("/vehicles/:id", auth("admin"), delete_vehicle);

export const vehicle_router = router;
