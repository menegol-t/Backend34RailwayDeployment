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
const child_process_1 = __importDefault(require("child_process"));
const path_1 = __importDefault(require("path"));
const checkLogIn_1 = require("../middlewares/checkLogIn");
const timeWasterPath = path_1.default.resolve(__dirname, "../controllers/randomsTimeWaster");
const randoms = (0, express_1.Router)();
randoms.get("/", checkLogIn_1.checkLogIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const timeWaster = child_process_1.default.fork(timeWasterPath);
    const { cant } = req.query;
    timeWaster.send(`${cant}`);
    timeWaster.on("message", (result) => {
        res.json({ result });
    });
}));
exports.default = randoms;
