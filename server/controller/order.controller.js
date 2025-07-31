import Order from "../models/order.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { user, items, shipping, paymentProof, totalAmount } = req.body;

    // Validate required fields
    if (!user || !items || !shipping || !paymentProof || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (user, items, shipping, paymentProof, totalAmount)",
      });
    }

    // Create the order with status "pending"
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
    const orders = await Order.find({ "user.email": req.user.email }).sort({ createdAt: -1 });

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
      return res.status(404).json({ success: false, message: "Order not found" });
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
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
