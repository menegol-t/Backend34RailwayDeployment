import { Router, Response, Request, NextFunction } from "express";
import passport from "passport";

const  signupRoute = Router()

const passportOptions = {failureMessage: "Hubo un problema con tu email o password."}

signupRoute.get("/", async (req: Request, res: Response) => {
    res.render("signup")
})

signupRoute.post("/", (req:Request, res:Response, next:NextFunction) => {
    passport.authenticate("signup", passportOptions, (err, user, info) => {
        if(err){
            return next(err)
        }else if(!user){
            return res.render("signup", {error: info.message})
        }else{
            res.redirect("/")
        }
    })(req, res, next)
})

export default signupRoute