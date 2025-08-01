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
import analyticsRoutes from "./routes/analytics.route.js";

dotenv.config()

// App configuration
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
const allowedOrigins = [
  'https://trends-by-didi-server-admin.vercel.app/',
  'https://alli-trends-by-didi.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);



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
app.use("/api/analytics", analyticsRoutes);


app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
