import { User } from "../models/user.models.js";

export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.user.id;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "itemId and size are required",
      });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const variantKey = `${size}`;
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (cartData[itemId][variantKey]) {
      cartData[itemId][variantKey] += 1;
    } else {
      cartData[itemId][variantKey] = 1;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Item added to cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.user.id;

    if (!itemId || !size || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "itemId, size, and quantity are required",
      });
    }

    const variantKey = `${size}`;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId] || !cartData[itemId][variantKey]) {
      return res.status(400).json({
        success: false,
        message: "Item variant not found in cart",
      });
    }

    cartData[itemId][variantKey] = quantity;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Cart updated successfully",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id; // Extract userId from the authenticated user's token

        const userData = await User.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, cartData: userData.cartData });
    } catch (error) {
        console.error("Error fetching user cart:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const removeFromCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.user.id;

    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "itemId and size are required",
      });
    }

    const variantKey = `${size}`;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[itemId] && cartData[itemId][variantKey]) {
      delete cartData[itemId][variantKey];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId]; // no more variants
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { cartData } },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Item removed from cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
