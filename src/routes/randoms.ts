import { Router, Response, Request } from "express";
import child_process from "child_process"
import path from "path"
import { checkLogIn } from "../middlewares/checkLogIn";

const timeWasterPath = path.resolve(__dirname, "../controllers/randomsTimeWaster")

const randoms = Router()

randoms.get("/", checkLogIn, async (req: Request, res: Response) => {
    const timeWaster = child_process.fork(timeWasterPath)
    const {cant} = req.query
    timeWaster.send(`${cant}`)
    timeWaster.on("message", (result) => {
        res.json({result})
    })
})

export default randoms