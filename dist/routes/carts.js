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
const express_1 = require("express");
const userInputChecks_1 = require("../middlewares/userInputChecks");
const apiCartMethods_1 = require("../controllers/apiCartMethods");
const auth_1 = require("../middlewares/auth");
const checkLogIn_1 = require("../middlewares/checkLogIn");
const cartMethods_1 = require("../controllers/cartMethods");
const cartsRoute = (0, express_1.Router)();
cartsRoute.get("/", checkLogIn_1.checkLogIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cartData = yield (0, cartMethods_1.getCartByOwner)(req.user.email);
    cartData == false ? next() : res.render("home", { cartData });
}));
cartsRoute.post("/buy", checkLogIn_1.checkLogIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const cartFinished = yield (0, cartMethods_1.finishCartByOwner)(req.user);
    if (cartFinished == false) {
        res.redirect("/api/cart");
    }
    else {
        yield (0, cartMethods_1.createCartLogin)(req.user.email, next);
        res.redirect("/api/cart");
    }
}));
cartsRoute.get("/all", checkLogIn_1.checkLogIn, auth_1.checkAdmin, apiCartMethods_1.getAllCarts);
cartsRoute.get("/:cartId", checkLogIn_1.checkLogIn, auth_1.checkAdmin, apiCartMethods_1.getCartById);
cartsRoute.get("/:cartId/products", checkLogIn_1.checkLogIn, auth_1.checkAdmin, apiCartMethods_1.getProdsInsideCartId);
cartsRoute.post("/", checkLogIn_1.checkLogIn, auth_1.checkAdmin, apiCartMethods_1.createCart);
cartsRoute.post("/:cartId/products", checkLogIn_1.checkLogIn, auth_1.checkAdmin, userInputChecks_1.reqBody_ProdIdCheck, apiCartMethods_1.addProdToCart);
cartsRoute.delete("/:cartId", checkLogIn_1.checkLogIn, auth_1.checkAdmin, apiCartMethods_1.deleteCartById);
cartsRoute.delete("/:cartId/products", checkLogIn_1.checkLogIn, auth_1.checkAdmin, userInputChecks_1.reqBody_ProdIdCheck, apiCartMethods_1.deleteProdFromCart);
exports.default = cartsRoute;
