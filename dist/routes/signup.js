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
const signupRoute = (0, express_1.Router)();
const passportOptions = { failureMessage: "Hubo un problema con tu email o password." };
signupRoute.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("test.pug");
}));
signupRoute.post("/", (req, res, next) => {
    passport_1.default.authenticate("signup", passportOptions, (err, user, info) => {
        if (err) {
            return next(err);
        }
        else if (!user) {
            return res.render("test.pug", { error: info.message });
        }
        else {
            res.redirect("/");
        }
    })(req, res, next);
});
exports.default = signupRoute;
