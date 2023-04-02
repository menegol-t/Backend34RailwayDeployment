import { Router, Response, Request } from "express";
import { logger } from "../config/logger";
import { checkLogIn } from "../middlewares/checkLogIn";

const  logoutRoute = Router()

logoutRoute.get("/", checkLogIn, async (req: any, res: Response) => {
    const {name} = req.user

    req.logout((err) => {
		if(!err){
		    res.render("logout.pug", {goodbyeMsg: `Nos vemos ${name}`})
        }else{
            logger.error(`Error logout `, err)
        }
    })
})

export default logoutRoute