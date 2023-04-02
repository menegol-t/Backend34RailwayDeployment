import { Router, Response, Request } from "express";
import { checkLogIn } from "../middlewares/checkLogIn";

const  homeRoute = Router()

homeRoute.get("/", checkLogIn, async (req: any, res: Response) => {
    res.render("home.pug", {welcomeSign: `Hola, ${req.user.name}`})
})

export default homeRoute