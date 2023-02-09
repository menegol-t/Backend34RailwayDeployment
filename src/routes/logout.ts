import { Router, Response, Request } from "express";
import { logger } from "../config/logger";
import { checkLogIn } from "../middlewares/checkLogIn";

const  logoutRoute = Router()

logoutRoute.get("/", checkLogIn, async (req: any, res: Response) => {
    const {email} = req.user

    req.logout((err) => {
		if(!err){
		    res.render("logout", {goodbyeMsg: `Nos vemos ${email}`})
        }else{
            logger.error(`Error logout `, err)
        }
    })
})

export default logoutRoute