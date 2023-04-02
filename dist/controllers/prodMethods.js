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
exports.deleteProd = exports.updateProd = exports.saveProd = exports.getProdById = exports.getAllProd = void 0;
const prodsModel_1 = require("../models/prodsModel");
const logger_1 = require("../config/logger");
const getAllProd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allProds = yield prodsModel_1.ProductsModel.find();
        res.render("home.pug", { prodData: allProds, usrEmail: req.user.email });
    }
    catch (err) {
        logger_1.logger.error(`Error al buscar todos los productos en la DB`, err);
        next();
    }
});
exports.getAllProd = getAllProd;
const getProdById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const prod = yield prodsModel_1.ProductsModel.findById(productId);
        if (!prod) {
            res.status(400).json({
                msg: "No se encontro ningun producto con ese ID"
            });
        }
        else {
            res.render("home.pug", { prodById: prod });
        }
    }
    catch (err) {
        logger_1.logger.error(`Error searching prods by ID`, err);
        next();
    }
});
exports.getProdById = getProdById;
const saveProd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, price, thumbnail, thumbnail2, stock, description, alt, category } = req.body;
        const newProd = yield prodsModel_1.ProductsModel.create({ title, price, thumbnail, thumbnail2, stock, description, alt, category });
        res.send(`Succesfully saved: \n ${newProd}`);
    }
    catch (err) {
        logger_1.logger.error(`Error saving produt to DB`, err);
        next();
    }
});
exports.saveProd = saveProd;
const updateProd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const valuesToUpdate = {};
        for (let [key, value] of Object.entries(req.body)) {
            if (value !== undefined) {
                valuesToUpdate[key] = value;
            }
        }
        const prodToUpdate = yield prodsModel_1.ProductsModel.findByIdAndUpdate(productId, valuesToUpdate, { new: true });
        res.send(`Update succesful: \n ${prodToUpdate}`);
    }
    catch (err) {
        logger_1.logger.error(`Erro actualizando producto:`, err);
        next();
    }
});
exports.updateProd = updateProd;
const deleteProd = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield prodsModel_1.ProductsModel.findByIdAndDelete(productId);
        res.send(`Product with ID ${productId} deleted`);
    }
    catch (err) {
        logger_1.logger.error(`Error deleting prod form DB`, err);
    }
});
exports.deleteProd = deleteProd;
