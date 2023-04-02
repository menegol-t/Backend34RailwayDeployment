import mongoose from "mongoose"

const productsCollection = "product"

interface IProduct{
    title: string;
    price: number;
    thumbnail: string;
    thumbnail2: string;
    stock: number;
    description: string;
    alt: string;
    category: string;
    quantity: number
}

const productSchema = new mongoose.Schema<IProduct>(
    {
        title: {type: String, required: true},
        price: {type: Number, required: true},
        thumbnail: {type: String, required: true},
        thumbnail2: {type: String, required: true},
        stock: {type: Number, required: true, max: 50},
        description: {type: String, required: true},
        alt: {type: String, required: true},
        category: {type: String, required: true},
        quantity: {type: Number, default: 1}
    },
    {timestamps: true, versionKey: false}
)

export const ProductsModel = mongoose.model<IProduct>(
    productsCollection, productSchema
)