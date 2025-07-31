import express from "express";
import { getFullAnalytics } from "../controller/analytics.controller.js";
import adminAuth from "../middleware/admin.auth.js";

const router = express.Router();

router.get("/", adminAuth, getFullAnalytics);

export default router;
