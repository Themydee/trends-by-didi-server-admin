import Order from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { user, items, shipping, paymentProof, totalAmount } = req.body;

    if (!user || typeof user !== "object") {
      return res.status(400).json({ success: false, message: "Invalid user data" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Invalid items" });
    }

    if (!shipping || typeof shipping !== "object") {
      return res.status(400).json({ success: false, message: "Invalid shipping" });
    }

    if (!paymentProof) {
      return res.status(400).json({ success: false, message: "Payment proof is required" });
    }

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({ success: false, message: "Invalid total amount" });
    }

    // Step 1: Validate availability
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found` });
      }

      if (!Array.isArray(product.sizes)) {
        return res.status(400).json({ success: false, message: `${product.name} has no sizes` });
      }

      const sizeObj = product.sizes.find(
        (s) => s.size.toLowerCase() === item.size.toLowerCase()
      );

      if (!sizeObj || sizeObj.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} - Size ${item.size} is out of stock.`,
        });
      }
    }

    // Step 2: Deduct stock
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const sizeIndex = product.sizes.findIndex(
        (s) => s.size.toLowerCase() === item.size.toLowerCase()
      );

      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].quantity -= item.quantity;
        await product.save();
      }
    }

    // Step 3: Save order
    const newOrder = await Order.create({
      user,
      items,
      shipping,
      paymentMethod: "transfer",
      paymentProof,
      totalAmount,
      status: "pending",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    console.log("req.user.email:", req.user.email); // Add this line
    const orders = await Order.find({ email: req.user.email }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get My Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Only allow owner or admin to view
    if (req.user.role !== "admin" && req.user.email !== order.user.email) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get All Orders Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/orders/:id
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "paid", "shipped", "delivered"];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
