import { Router, Response, Request } from "express";
import passport from "passport";

const  loginRoute = Router()

loginRoute.get("/", async (req: Request, res: Response) => {
    res.render("login.pug")
})

loginRoute.post("/", passport.authenticate("login", {failureRedirect: "/api/login"}), async (req: Request, res: Response) => {
    res.redirect("/api/chat")
})

export default loginRoute