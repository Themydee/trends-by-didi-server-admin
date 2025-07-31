import { User } from "../models/user.models.js";
import { Product } from "../models/product.model.js";
import Order from "../models/order.model.js";


export const getFullAnalytics = async (req, res) => {
  try {
    const [userCount, productCount, totalOrders, pendingOrders, deliveredOrders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
    ]);

    const revenue = await Order.aggregate([
      {
        $match: { status: { $in: ["paid", "shipped", "delivered"] } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const dailyRevenue = await Order.aggregate([
      {
        $match: { status: { $in: ["paid", "shipped", "delivered"] } },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = await Order.aggregate([
      {
        $match: { status: { $in: ["paid", "shipped", "delivered"] } },
      },
      {
        $group: {
          _id: null,
          amount: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      users: userCount,
      products: productCount,
      orders: totalOrders,
      pending: pendingOrders,
      delivered: deliveredOrders,
      revenue: totalRevenue[0]?.amount || 0,
      monthlyRevenue: revenue,
      dailyRevenue: dailyRevenue,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
