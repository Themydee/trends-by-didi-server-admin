// routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/order.controller.js";
import authUser from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/admin.auth.js";

const router = express.Router();


router.post("/", authUser, placeOrder);

router.get("/my", authUser, getMyOrders);


router.get("/:id", authUser, getOrderById);
// GET /api/orders - Admin gets all orders
router.get("/", adminAuth, async (req, res, next) => {
  if (req.admin.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  return getAllOrders(req, res, next);
});

// PATCH /api/orders/:id - Admin updates order status
router.patch("/:id", adminAuth, async (req, res, next) => {
  if (req.admin.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin only" });
  }
  return updateOrderStatus(req, res, next);
});


export default router;
