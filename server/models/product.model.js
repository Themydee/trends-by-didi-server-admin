import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  isWholesale: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: Array, // for retail products only
    required: function () {
      return !this.isWholesale; // sizes required if not wholesale
    },
  },
  stock: {
    type: Number, // used for wholesale stock only
    default: 0,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  colors: {
    type: Array,
    default: [],
  },
  date: {
    type: Number,
    required: true,
  },
});

export const Product = mongoose.model('Product', productSchema);
