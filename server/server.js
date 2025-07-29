import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/db.js'
import connectCloud from './config/cloudinary.js'
import userRoute from './routes/user.route.js'
import productRoute from './routes/product.route.js'

dotenv.config()

// App configuration
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors({
  origin: '*', 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] 
}))

// Connect DB
db() 
connectCloud()

// API routes
app.use('/api/user', userRoute) // auth route
app.use('/api/product', productRoute)

app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
