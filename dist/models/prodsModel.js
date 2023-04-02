"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productsCollection = "product";
const productSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    thumbnail2: { type: String, required: true },
    stock: { type: Number, required: true, max: 50 },
    description: { type: String, required: true },
    alt: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, default: 1 }
}, { timestamps: true, versionKey: false });
exports.ProductsModel = mongoose_1.default.model(productsCollection, productSchema);
