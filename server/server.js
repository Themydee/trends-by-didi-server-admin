import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js'
import connectCloud from './config/cloudinary.js'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import uploadRoutes from './routes/upload.route.js';
import orderRoutes from './routes/order.route.js';

dotenv.config()

// App configuration
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "token"],
}))

// Connect DB
db() 
connectCloud()

// API routes
app.use('/api/user', userRoute) // auth route
app.use('/api/product', productRoute)
app.use('/api/cart', cartRoute)
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));


app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
