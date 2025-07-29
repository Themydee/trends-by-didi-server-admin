import { User } from "../models/user.models.js"
import bcrypt from 'bcrypt'
import validator from 'validator'
import jwt from 'jsonwebtoken'

export const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please use a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

       // Generate JWT token with userId
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });


        return res.status(201).json({
            success: true,
            message: "User created successfully",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}


export const adminLogin = async(req, res) => {
     try {
        const {email, password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(
               { email, role: 'admin' }, // payload as object
               process.env.JWT_SECRET_KEY,
               { expiresIn: '1h' }
            );

            res.cookie("token", token, {
                httpOnly: true,  
                maxAge: 3600000, // 1 hour
            });

            return res.status(200).json({
                success: true,
                message: "You have been successfully logged in as admin",
                token,
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid credentials" });    
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const loginUser = async(req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token with userId
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000, // 1 hour
        });

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "You have been successfully logged in",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}