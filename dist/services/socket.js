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
const socket_io_1 = require("socket.io");
const logger_1 = require("../config/logger");
const chatMsgs_1 = require("../controllers/chatMsgs");
const cartMethods_1 = require("../controllers/cartMethods");
const io = new socket_io_1.Server;
const initWebSocket = (server) => {
    io.attach(server);
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info("New WS connection");
        socket.emit("fetchMsgsFromDB", yield (0, chatMsgs_1.getAllMsgs)());
        socket.on("postMsgToDB", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            io.emit("newMsgInDB", yield (0, chatMsgs_1.saveMsg)(msg));
        }));
        socket.on("addProdToCart", (order) => __awaiter(void 0, void 0, void 0, function* () {
            io.emit("prodAddedToCart", yield (0, cartMethods_1.addOrderToCart)(order));
        }));
    }));
};
exports.default = initWebSocket;
