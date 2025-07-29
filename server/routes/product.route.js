import express from 'express'
import { createProduct, listProduct, deleteProduct, singleProduct } from '../controller/product.controller.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/admin.auth.js'



const router = express.Router() 

router.post('/create', 
    adminAuth,
    upload.fields([
        {name: 'image1', maxCount:1}, 
        {name: 'image2', maxCount:1}, 
        {name: 'image3', maxCount:1}, 
        {name: 'image4', maxCount:1}
    ]), createProduct)

router.get('/list', listProduct)

router.post('/delete', adminAuth, deleteProduct)

router.post('/single',singleProduct)

export default router;