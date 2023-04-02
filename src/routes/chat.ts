import { Router, Response } from "express";
import { checkLogIn } from "../middlewares/checkLogIn";

const  chatRoute = Router()

chatRoute.get("/", checkLogIn, async (req: any, res: Response) => {
    res.render("home.pug", {email: `${req.user.email}`})
})

export default chatRoute