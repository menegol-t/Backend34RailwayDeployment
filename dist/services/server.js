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
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const endpoints_1 = __importDefault(require("../routes/endpoints"));
const util = __importStar(require("util"));
const http_1 = __importDefault(require("http"));
require("dotenv/config");
const checkLogIn_1 = require("../middlewares/checkLogIn");
const passport_1 = __importDefault(require("passport"));
const auth_1 = require("./auth");
const compression_1 = __importDefault(require("compression"));
const logger_1 = require("../config/logger");
const socket_1 = __importDefault(require("./socket"));
const helmet_1 = __importDefault(require("helmet"));
const ttlSeconds = 600;
const sessionOptions = {
    secret: "shhhhhhhhhhh",
    resave: true,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: ttlSeconds * 1000 }
};
const app = (0, express_1.default)();
const viewsFolderPath = path_1.default.resolve(__dirname, "../views");
//IMPORTANT: Por algun motivo, cuando corres la version minimizada usando webpack, esta variable tiene que estar como const viewsFolderPath = path.resolve(__dirname, "../views").
//Pero si corres la version typescript, tiene que estar como const viewsFolderPath = path.resolve(__dirname, "../../views")
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(util.inspect(err, true, 7, true));
    return res.status(500).json({
        msg: "Unexpected error",
        err
    });
};
app.use((0, helmet_1.default)());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
app.use((0, express_session_1.default)(sessionOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info(`PID: ${process.pid}, Route ${req.method} ${req.url} requested.`);
    next();
}));
passport_1.default.use("login", auth_1.loginFunc);
passport_1.default.use("signup", auth_1.signUpFunc);
app.set("views", viewsFolderPath);
app.set("view engine", "pug");
app.get("/", checkLogIn_1.checkLogIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.redirect("/api/home");
}));
app.use("/api", endpoints_1.default);
app.use(errorHandler);
app.get('*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.warn(`PID: ${process.pid}, Route ${req.method} ${req.url} doesn't exist.`);
    res.status(400).redirect("/");
}));
const server = new http_1.default.Server(app);
(0, socket_1.default)(server);
exports.default = server;
