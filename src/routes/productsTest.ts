import { Router, Response, Request } from "express";
import randomProd from "../controllers/fakeController"
import { checkAdmin } from "../middlewares/auth";
import { checkLogIn } from "../middlewares/checkLogIn";

const  productsTestRoute = Router()

productsTestRoute.get("/", checkLogIn, checkAdmin, async (req: Request, res: Response) => {
    res.render("prodIndex.pug", {prodData: await randomProd()})
})

export default productsTestRoute