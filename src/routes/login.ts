import { Router, Response, Request, NextFunction } from "express";
import passport from "passport";
import { logger } from "../config/logger";
import { createCartLogin } from "../controllers/cartMethods";

const  loginRoute = Router()

loginRoute.get("/", async (req: Request, res: Response) => {
    res.render("login.pug")
})

loginRoute.post("/",(req:Request, res:Response, next:NextFunction) => {
    passport.authenticate("login", async (err, user, info) => {
        if(err){
            logger.error(err)
            return next(err)
        }else if(!user){
            logger.warn(err)
            return res.status(400).render("login.pug", {invalidUser: info.message})
        }else{
            req.logIn(user, async (err) => {
                if(err){
                    logger.error(`Error en login `, err)
                    next(err)
                }else{
                    try {
                        await createCartLogin(user.email, next)
                        res.status(200).redirect("/api/home")
                    } catch (err) {
                        logger.error(`Error en la creacion de cart.`)
                    }
                }
            });
        }
    })(req, res, next);
})

export default loginRoute