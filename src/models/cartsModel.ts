import mongoose from "mongoose";

export const cartCollection = "cart"

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

interface ICart {
    products: IProduct[],
    owner: string,
    done: boolean
}

const cartSchema = new mongoose.Schema<ICart>(
    {
        products: {type: [], required: true},
        owner: {type: String, required: true},
        done: {type: Boolean, required: true, default: false}
    },
    {timestamps: true, versionKey: false}
)

export const CartModel = mongoose.model<ICart>(cartCollection, cartSchema)