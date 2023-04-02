import twilio from 'twilio'
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message'
import { logger } from '../config/logger'

const accountSid = process.env.TWILIO_ACCOUNT_ID
const authToken = process.env.TWILIO_TOKEN

const client = twilio(accountSid, authToken)

export const sendSms = async (phoneNumber: string, msg: string) => {
    try {
         await client.messages.create({
           body: msg,
           from: process.env.TWILIO_CELLPHONE,
           to: phoneNumber
        })
     } catch (err) {
        logger.error(err)
     }
}

export const sendWhatsapp = async (phoneNumber: string, msg: any, picture?: string) => {
   try {
      const message: MessageListInstanceCreateOptions = {
         body: msg,
         from: `whatsapp:${process.env.TWILIO_WHATSAPP_SANDBOX}`,
         to: `whatsapp:+${phoneNumber}`
      }

      if(picture){
         message.mediaUrl = [picture]
      }

      await client.messages.create(message)
      
   } catch (err) {
      logger.error(err)
   }
}