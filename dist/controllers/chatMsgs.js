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
exports.getAllMsgs = exports.saveMsg = void 0;
const chaMsgModel_1 = require("../models/chaMsgModel");
const normalizr_1 = require("normalizr");
const logger_1 = require("../config/logger");
const author = new normalizr_1.schema.Entity("author", {}, { idAttribute: "email" });
const msg = new normalizr_1.schema.Entity("messages", { author: author }, { idAttribute: "_id" });
const finalSchema = [msg];
//hasta ahi arriba la definicion de esquemas.
//los datos NO los guardo normalizados en mongo. La entrega pide que los datos se lean
//y DESPUES que el backend los normalice para que al front le lleguen normalizados.
const saveMsg = (ms) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const savedMsg = yield chaMsgModel_1.ChatMsgModel.create(ms);
        return savedMsg;
    }
    catch (err) {
        logger_1.logger.error(`Error saving message to DB `, err);
    }
});
exports.saveMsg = saveMsg;
const getAllMsgs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield chaMsgModel_1.ChatMsgModel.find().lean();
        const normalizedData = (0, normalizr_1.normalize)(rawData, finalSchema);
        return normalizedData;
    }
    catch (err) {
        logger_1.logger.error(`Error retrieving chats from DB `, err);
    }
});
exports.getAllMsgs = getAllMsgs;
