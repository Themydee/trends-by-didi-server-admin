import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("🛰️ MongoDB connected successfully")
    } catch (error) {
        console.error(`❌ Error connecting to database: ${error.message}`);
        process.exit(1);
    }
}


export default db;
