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
const normalizr_1 = require("normalizr");
const logger_1 = require("../config/logger");
const userModel_1 = require("../models/userModel");
const chatMsgModel_1 = require("../models/chatMsgModel");
const author = new normalizr_1.schema.Entity("author", {}, { idAttribute: "email" });
const msg = new normalizr_1.schema.Entity("messages", { author: author }, { idAttribute: "_id" });
const finalSchema = [msg];
const saveMsg = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = msg;
        return yield userModel_1.UserModel.findOne({ email: email }).then((usr) => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                author: usr,
                text: msg.text
            };
            try {
                const savedMsg = yield chatMsgModel_1.ChatMsgModel.create(data);
                console.log(savedMsg);
                return savedMsg;
            }
            catch (err) {
                logger_1.logger.error(`Error saving message in DB `, err);
            }
        }));
    }
    catch (err) {
        logger_1.logger.error(`Error searching user in DB `, err);
    }
});
exports.saveMsg = saveMsg;
const getAllMsgs = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield chatMsgModel_1.ChatMsgModel.find().lean();
        const normalizedData = (0, normalizr_1.normalize)(rawData, finalSchema);
        return normalizedData;
    }
    catch (err) {
        logger_1.logger.error(`Error retrieving chats from DB `, err);
    }
});
exports.getAllMsgs = getAllMsgs;
