import { Router, Response, Request } from "express";
import { args } from "../config/arguments";
import os from "os"

const infoRoute = Router()

infoRoute.get("/", async (req: Request, res: Response) => {
    res.json({
        Arguments: args,
        SO: process.platform,
        NodeVersion: process.version,
        Memory: process.memoryUsage(),
        ExecPath: process.execPath,
        PID: process.pid,
        Folder: process.cwd(),
        CPUs: os.cpus().length
    })
})

export default infoRoute