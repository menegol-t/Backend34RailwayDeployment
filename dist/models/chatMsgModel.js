"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMsgModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatMsgsCollection = "chatMsg";
const chatMsgSchema = new mongoose_1.default.Schema({
    author: {
        email: { type: String },
        name: { type: String },
        password: { type: String },
        location: { type: String },
        age: { type: Number },
        phone: { type: Number },
        profileThumbnail: { type: String }
    },
    text: { type: String, required: true }
}, { timestamps: true, versionKey: false });
exports.ChatMsgModel = mongoose_1.default.model(chatMsgsCollection, chatMsgSchema);
