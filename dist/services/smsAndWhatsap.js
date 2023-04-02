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
exports.sendWhatsapp = exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const logger_1 = require("../config/logger");
const accountSid = process.env.TWILIO_ACCOUNT_ID;
const authToken = process.env.TWILIO_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const sendSms = (phoneNumber, msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.messages.create({
            body: msg,
            from: process.env.TWILIO_CELLPHONE,
            to: phoneNumber
        });
    }
    catch (err) {
        logger_1.logger.error(err);
    }
});
exports.sendSms = sendSms;
const sendWhatsapp = (phoneNumber, msg, picture) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            body: msg,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_SANDBOX}`,
            to: `whatsapp:+${phoneNumber}`
        };
        if (picture) {
            message.mediaUrl = [picture];
        }
        yield client.messages.create(message);
    }
    catch (err) {
        logger_1.logger.error(err);
    }
});
exports.sendWhatsapp = sendWhatsapp;
