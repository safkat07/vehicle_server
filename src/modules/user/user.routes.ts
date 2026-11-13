import express from "express";
import { user_controller } from "./user.controller";
import auth from "../../middleware/auth";
const router = express.Router();

const { create_user, get_user } = user_controller;

router.post("/signup", create_user);
router.get("/users", auth("admin"), get_user);
export const user_router = router;
