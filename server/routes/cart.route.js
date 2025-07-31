import express from 'express'
import { addToCart, updateCart, getUserCart, removeFromCart } from '../controller/cart.controller.js'
import authUser from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/add', authUser, addToCart)

router.post('/update', authUser, updateCart)

router.post('/get', authUser, getUserCart)

router.delete('/remove', authUser, removeFromCart)

export default router;