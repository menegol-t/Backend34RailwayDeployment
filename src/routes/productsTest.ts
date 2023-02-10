import { Router, Response, Request } from "express";
import randomProd from "../controllers/fakeController"

const  productsTestRoute = Router()

productsTestRoute.get("/", async (req: Request, res: Response) => {
    res.render("prodIndex.pug", {allData: await randomProd()})
})

export default productsTestRoute