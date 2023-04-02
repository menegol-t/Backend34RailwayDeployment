"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProdFromCart = exports.addProdToCart = exports.deleteCartById = exports.createCart = exports.getProdsInsideCartId = exports.getCartById = exports.getAllCarts = void 0;
const cartsModel_1 = require("../models/cartsModel");
const prodsModel_1 = require("../models/prodsModel");
const logger_1 = require("../config/logger");
const getAllCarts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const carts = yield cartsModel_1.CartModel.find();
        res.send(carts);
    }
    catch (err) {
        logger_1.logger.error(err);
        next(err);
    }
});
exports.getAllCarts = getAllCarts;
const getCartById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        const cart = yield cartsModel_1.CartModel.findById(cartId);
        if (!cart) {
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            });
        }
        else {
            res.send(cart);
        }
    }
    catch (err) {
        logger_1.logger.error(err);
        next(err);
    }
});
exports.getCartById = getCartById;
const getProdsInsideCartId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield (0, exports.getCartById)(req, res, next);
        res.send(cart.products);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                msg: "Get products in cart error",
                error: err
            });
        }
        else {
            next(err);
        }
    }
});
exports.getProdsInsideCartId = getProdsInsideCartId;
const createCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCart = yield cartsModel_1.CartModel.create({ products: [] });
        res.send(`Cart created: ${newCart}`);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                msg: "Create cart error",
                error: err
            });
        }
        else {
            next(err);
        }
    }
});
exports.createCart = createCart;
const deleteCartById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cartId } = req.params;
        yield cartsModel_1.CartModel.findByIdAndDelete(cartId);
        res.send(`Cart with ID ${cartId} deleted.`);
    }
    catch (err) {
        logger_1.logger.error(err);
        next(err);
    }
});
exports.deleteCartById = deleteCartById;
const addProdToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const prod = yield prodsModel_1.ProductsModel.findById(productId);
        const cartToUpdate = yield (0, exports.getCartById)(req, res, next);
        const { products } = cartToUpdate;
        const { cartId } = req.params;
        if (!prod) {
            res.status(400).json({
                msg: "No se encontro ningun producto con ese ID"
            });
        }
        else if (!cartToUpdate) {
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            });
        }
        else {
            products.push(prod);
            const CartProdsToUpdate = yield cartsModel_1.CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            res.send(`Cart changed: ${CartProdsToUpdate}`);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                msg: "Add product to cart error",
                error: err
            });
        }
        else {
            next(err);
        }
    }
});
exports.addProdToCart = addProdToCart;
const deleteProdFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const prod = yield prodsModel_1.ProductsModel.findById(productId);
        const cartToUpdate = yield (0, exports.getCartById)(req, res, next);
        const { products } = cartToUpdate;
        const { cartId } = req.params;
        if (!prod) {
            res.status(400).json({
                msg: "Ese producto no esta en el carro"
            });
        }
        else if (!cartToUpdate) {
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            });
        }
        else {
            removeProdById(products, productId);
            const CartProdsToUpdate = yield cartsModel_1.CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            res.send(`Cart changed: ${CartProdsToUpdate}`);
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({
                msg: "Delete product from cart error",
                error: err
            });
        }
        else {
            next(err);
        }
    }
});
exports.deleteProdFromCart = deleteProdFromCart;
function removeProdById(arr, id) {
    const indexOfProd = arr.findIndex((obj) => obj._id == id);
    if (indexOfProd > -1) {
        arr.splice(indexOfProd, 1);
    }
    return arr;
}
