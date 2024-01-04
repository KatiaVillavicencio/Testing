import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection="products"

const productSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    category: {
        type: String, max: 50 ,
        required: true
    },
    status: {
        type: Boolean,
        default: true 
    },
    availability: 
    { type: String, enum: ['in_stock', 'out_of_stock'] },

    owner: {
        type: String,
        default:  "Admin"
    }
})
productSchema.plugin(mongoosePaginate)

export const productsModel = mongoose.model(productCollection,productSchema)
