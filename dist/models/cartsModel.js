"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModel = exports.cartCollection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.cartCollection = "cart";
const cartSchema = new mongoose_1.default.Schema({
    products: { type: [], required: true },
    owner: { type: String, required: true },
    done: { type: Boolean, required: true, default: false }
}, { timestamps: true, versionKey: false });
exports.CartModel = mongoose_1.default.model(exports.cartCollection, cartSchema);
