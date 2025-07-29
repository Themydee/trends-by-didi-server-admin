import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Ensure the token contains the correct admin email and role
    if (
      decoded.email !== process.env.ADMIN_EMAIL ||
      decoded.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid admin credentials.",
      });
    }

    req.admin = decoded; // Optional: pass decoded info to next middleware
    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export default adminAuth;
