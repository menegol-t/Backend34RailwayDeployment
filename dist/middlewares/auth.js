"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = void 0;
const admin_1 = __importDefault(require("../config/admin"));
const checkAdmin = (req, res, next) => {
    if (!admin_1.default.admin) {
        return res.status(401).json({ err: -1, msg: "No estas autorizado." });
    }
    next();
};
exports.checkAdmin = checkAdmin;
