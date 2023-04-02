import mongoose from "mongoose";

const chatMsgsCollection = "chatMsg"

interface IMsg{
    email: string, 
    name: string, 
    password: string,
    location: string,
    age: number,
    phone: number,
    profileThumbnail: string,
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
            password: {type: String},
            location: {type: String},
            age: {type: Number},
            phone: {type: Number},
            profileThumbnail: {type: String}
        },
        text: {type: String, required: true}
    },
    {timestamps: true, versionKey: false}
)

export const ChatMsgModel = mongoose.model<IChatMsg>(
    chatMsgsCollection, chatMsgSchema
)