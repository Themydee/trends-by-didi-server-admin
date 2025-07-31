// models/Order.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
}, { _id: false });

const itemSchema = new mongoose.Schema({
  productId: String, // Product ID as string
  title: String,
  image: [String],
  price: Number,
  size: String,
  quantity: Number,
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  group: String,
  price: Number,
  locations: [String],
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: userSchema,
    required: true,
  },
  items: {
    type: [itemSchema],
    required: true,
  },
  shipping: {
    type: shippingSchema,
    required: true,
  },
  paymentMethod: {
  type: String,
  enum: ["transfer"], 
  default: "transfer",
  },
  paymentProof: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
