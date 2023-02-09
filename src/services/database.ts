import mongoose from "mongoose";
import { logger } from "../config/logger";

const connectionString = process.env.MONGO_ATLAS_SRV || "mongodb://localhost:27017/miDatabase"

export const innitMongo = async() => {
    try{
        logger.info(`Conecting to mongo`);
        await mongoose.connect(connectionString)
    }catch(err){
        logger.error(`Error initializing connection to DB `, err);
        return err
    }
}