"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
require("dotenv/config");
const email_1 = require("../services/email");
const utils = __importStar(require("util"));
const signupRoute = (0, express_1.Router)();
const passportOptions = { failureMessage: "Hubo un problema con tu email o password." };
signupRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("signup.pug");
}));
signupRoute.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("signup", passportOptions, (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            logger_1.logger.error(err);
            return next(err);
        }
        else if (!user) {
            return res.status(400).render("signup.pug", { error: info.message });
        }
        else {
            const mailOptions = {
                from: process.env.ETHEREAL_EMAIL,
                to: process.env.ETHEREAL_EMAIL,
                subject: 'Nuevo Registro en NodeJS',
                html: `
                <h1>Hubo un nuevo registro de usuario.</h1>
                <p>${user}</p>
                `
            };
            try {
                const info = yield email_1.transporter.sendMail(mailOptions);
                logger_1.logger.info(utils.inspect(info, true, 7, true));
                res.status(200).render("login.pug", { invalidUser: "Perfecto! Ahora logueate con tus nuevas credenciales." });
            }
            catch (err) {
                logger_1.logger.error("Error al enviar mail de registro", err);
                res.redirect("/api/signup");
            }
        }
    }))(req, res, next);
}));
exports.default = signupRoute;
