import { Router, Response, NextFunction} from "express"; 
import {reqBody_ProdIdCheck} from "../middlewares/userInputChecks"
import { getAllCarts, getCartById, getProdsInsideCartId, createCart, deleteCartById, addProdToCart, deleteProdFromCart } from "../controllers/apiCartMethods"
import { checkAdmin } from "../middlewares/auth";
import { checkLogIn } from "../middlewares/checkLogIn";
import {createCartLogin, finishCartByOwner, getCartByOwner} from "../controllers/cartMethods"

const cartsRoute = Router()

cartsRoute.get("/", checkLogIn, async (req: any, res: Response, next: NextFunction) => {
    const cartData = await getCartByOwner(req.user.email)
    cartData == false ? next() : res.render("home", {cartData})
})

cartsRoute.post("/buy", checkLogIn, async (req: any, res: Response, next: NextFunction) => {
    const cartFinished = await finishCartByOwner(req.user)
    if (cartFinished == false){
        res.redirect("/api/cart")
    }else{
        await createCartLogin(req.user.email, next)
        res.redirect("/api/cart")
    } 
})

cartsRoute.get("/all", checkLogIn, checkAdmin, getAllCarts)

cartsRoute.get("/:cartId", checkLogIn, checkAdmin, getCartById)

cartsRoute.get("/:cartId/products", checkLogIn, checkAdmin, getProdsInsideCartId)

cartsRoute.post("/", checkLogIn, checkAdmin, createCart)

cartsRoute.post("/:cartId/products", checkLogIn, checkAdmin, reqBody_ProdIdCheck, addProdToCart)

cartsRoute.delete("/:cartId", checkLogIn, checkAdmin, deleteCartById)

cartsRoute.delete("/:cartId/products", checkLogIn, checkAdmin, reqBody_ProdIdCheck, deleteProdFromCart)

export default cartsRoute