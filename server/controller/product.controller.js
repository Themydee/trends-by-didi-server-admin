import { Product } from '../models/product.model.js';
import {v2 as cloudinary} from 'cloudinary';


export const createProduct = async (req, res) => {
  try {
     const { name, description, price, category, subCategory,sizes, colors, popular } = req.body;

        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imageUrls = await Promise.all(
            images.map(async(item) => {
                let result = await cloudinary.uploader.upload(item.path, {
                    resource_type: 'image'
                });
                return result.secure_url;
            })
        )

        const productData = {
            name, 
            description,
            price: Number(price),
            category,
            subCategory,
            popular: popular === 'true' ? true : false,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            image: imageUrls,
            date: Date.now()
        }

        console.log(productData)

        const product = new Product(productData);
        await product.save();

         res.status(201).json({
            success: true,
            message: "Product created successfully",
           
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const deleteProduct = async (req, res) => {
      try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }

};


export const singleProduct = async (req,res) => {
   try{
        const {productId} = req.body;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const listProduct = async (req, res) => {
    try {
        const product = await Product.find({})
        return res.status(200).json({
            success: true,
            message: "Product list fetched successfully",
            product
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message });
    }
}