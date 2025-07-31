import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, please login again' });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!token_decode.id) {
            return res.status(403).json({ success: false, message: 'Invalid token payload' });
        }

        req.user = { id: token_decode.id }; // Attach user ID to req.user
        next();
    } catch (error) {
        console.error('JWT Error:', error);
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};

export default authUser;