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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const logger_1 = require("../config/logger");
const cartMethods_1 = require("../controllers/cartMethods");
const loginRoute = (0, express_1.Router)();
loginRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("login.pug");
}));
loginRoute.post("/", (req, res, next) => {
    passport_1.default.authenticate("login", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            logger_1.logger.error(err);
            return next(err);
        }
        else if (!user) {
            logger_1.logger.warn(err);
            return res.status(400).render("login.pug", { invalidUser: info.message });
        }
        else {
            req.logIn(user, (err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    logger_1.logger.error(`Error en login `, err);
                    next(err);
                }
                else {
                    try {
                        yield (0, cartMethods_1.createCartLogin)(user.email, next);
                        res.status(200).redirect("/api/home");
                    }
                    catch (err) {
                        logger_1.logger.error(`Error en la creacion de cart.`);
                    }
                }
            }));
        }
    }))(req, res, next);
});
exports.default = loginRoute;
