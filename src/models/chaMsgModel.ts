import mongoose from "mongoose";

const chatMsgsCollection = "chatMsg"

interface IMsg{
    email: string, 
    name: string, 
    surname: string,
    age: number,
    alias: string,
    avatar: string
}

interface IChatMsg{
    author: IMsg,
    text: string
}

const chatMsgSchema = new mongoose.Schema<IChatMsg>(
    {
        author: {
            email: {type: String},
            name: {type: String},
            surname: {type: String},
            age: {type: Number},
            alias: {type: String},
            avatar: {type: String}
        },
        text: {type: String, required: true}
    },
    {timestamps: true, versionKey: false}
)

export const ChatMsgModel = mongoose.model<IChatMsg>(
    chatMsgsCollection, chatMsgSchema
)