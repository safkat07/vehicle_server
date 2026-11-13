import express from "express";
import { auth_controller } from "./auth.controller";

const router = express.Router();
router.post("/signin", auth_controller.login_user);

export const auth_router = router;
