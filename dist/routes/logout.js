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
const logger_1 = require("../config/logger");
const checkLogIn_1 = require("../middlewares/checkLogIn");
const logoutRoute = (0, express_1.Router)();
logoutRoute.get("/", checkLogIn_1.checkLogIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.user;
    req.logout((err) => {
        if (!err) {
            res.render("logout.pug", { goodbyeMsg: `Nos vemos ${name}` });
        }
        else {
            logger_1.logger.error(`Error logout `, err);
        }
    });
}));
exports.default = logoutRoute;
