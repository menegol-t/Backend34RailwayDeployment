import { normalize, schema } from "normalizr";
import { logger } from "../config/logger";
import { UserModel } from "../models/userModel";
import { ChatMsgModel } from "../models/chatMsgModel";

const author = new schema.Entity("author", {}, {idAttribute: "email"})
const msg = new schema.Entity("messages", {author: author}, {idAttribute: "_id"})

const finalSchema = [msg]

export const saveMsg = async (msg: any) => {
    try {

        const {email} = msg        

        return await UserModel.findOne({email: email}).then(async (usr) => {

            const data =  {
                author: usr,
                text: msg.text
            }

            try {                
                const savedMsg = await ChatMsgModel.create(data)
                console.log(savedMsg);
                return savedMsg
            } catch (err) {
                logger.error(`Error saving message in DB `, err)       
            }

        }) 
    } catch (err) {
        logger.error(`Error searching user in DB `, err)       
    } 
}

export const getAllMsgs = async () => {
    try {
        const rawData = await ChatMsgModel.find().lean()
        const normalizedData = normalize(rawData, finalSchema)
        return normalizedData
    } catch (err) {
        logger.error(`Error retrieving chats from DB `, err)
    }
}