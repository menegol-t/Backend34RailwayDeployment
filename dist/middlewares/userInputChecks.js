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
exports.reqBodyUpdateCheck = exports.reqBody_ProdIdCheck = exports.requestParamCheck = exports.requestBodyCheck = void 0;
const requestBodyCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.title || !req.body.price || !req.body.thumbnail || !req.body.stock || !req.body.description) {
        return res.status(401).json({ Error: "Por favor completa los campos 'title', 'price', 'thumbnail', 'stock' y 'description'." });
    }
    if (isNaN(req.body.price) || isNaN(req.body.stock)) {
        return res.status(401).json({ Error: "Los campos 'price' y 'stock' debe ser un numero." });
    }
    next();
});
exports.requestBodyCheck = requestBodyCheck;
const requestParamCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.productId) {
        return res.status(401).json({ Error: "Se requiere un ID del producto." });
    }
    next();
});
exports.requestParamCheck = requestParamCheck;
const reqBody_ProdIdCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.productId) {
        return res.status(401).json({ Error: "Por favor completa el campo 'productId' en el body para añadir o eliminar ese producto del carrito." });
    }
    next();
});
exports.reqBody_ProdIdCheck = reqBody_ProdIdCheck;
const reqBodyUpdateCheck = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.price && isNaN(req.body.price)) {
        return res.status(401).json({ Error: "El campo 'price' debe ser un numero." });
    }
    else if (req.body.stock && isNaN(req.body.stock)) {
        return res.status(401).json({ Error: "El campo 'stock' debe ser un numero." });
    }
    next();
});
exports.reqBodyUpdateCheck = reqBodyUpdateCheck;
