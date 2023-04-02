import { Router, Response, Request, NextFunction } from "express";
import passport from "passport";
import { logger } from "../config/logger";
import "dotenv/config"
import {transporter} from "../services/email"
import * as utils from "util"

const  signupRoute = Router()

const passportOptions = {failureMessage: "Hubo un problema con tu email o password."}

signupRoute.get("/", async (req: Request, res: Response) => {
    res.render("signup.pug")
})

signupRoute.post("/", async (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate("signup", passportOptions, async (err, user, info) => {
        if(err){
            logger.error(err)
            return next(err)
        }else if(!user){
            return res.status(400).render("signup.pug", {error: info.message})
        }else{

            const mailOptions = {
                from: process.env.ETHEREAL_EMAIL,
                to: process.env.ETHEREAL_EMAIL,
                subject: 'Nuevo Registro en NodeJS',
                html: `
                <h1>Hubo un nuevo registro de usuario.</h1>
                <p>${user}</p>
                `
            }

            try {
                const info = await transporter.sendMail(mailOptions)
                logger.info(utils.inspect(info, true, 7, true))
                res.status(200).render("login.pug", {invalidUser: "Perfecto! Ahora logueate con tus nuevas credenciales."})
            }catch(err){
                logger.error("Error al enviar mail de registro", err)
                res.redirect("/api/signup")
            }             
        }
    })(req, res, next)
})

export default signupRoute 