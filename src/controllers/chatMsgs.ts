import { ChatMsgModel } from "../models/chaMsgModel";
import { normalize, schema } from "normalizr";
import { logger } from "../config/logger";

const author = new schema.Entity("author", {}, {idAttribute: "email"})

const msg = new schema.Entity("messages", {author: author}, {idAttribute: "_id"})

const finalSchema = [msg]

//hasta ahi arriba la definicion de esquemas.

//los datos NO los guardo normalizados en mongo. La entrega pide que los datos se lean
//y DESPUES que el backend los normalice para que al front le lleguen normalizados.

export const saveMsg = async (ms) => {
    try {
        const savedMsg = await ChatMsgModel.create(ms)
        return savedMsg
    } catch (err) {
        logger.error(`Error saving message to DB `, err)       
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