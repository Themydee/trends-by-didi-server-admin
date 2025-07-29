import express from 'express';

import { registerUser, loginUser, adminLogin } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/admin", adminLogin)

export default router;