import { Router } from "express";
import { requestBodyCheck, requestParamCheck, reqBodyUpdateCheck } from "../middlewares/userInputChecks";
import {getAllProd, getProdById, saveProd, updateProd, deleteProd}  from "../controllers/prodMethods";
import { checkAdmin } from "../middlewares/auth"
import { checkLogIn } from "../middlewares/checkLogIn";

const prodsRoute = Router()

prodsRoute.get("/", checkLogIn, getAllProd)

prodsRoute.get("/:productId", checkLogIn, checkAdmin, requestParamCheck, getProdById)

prodsRoute.post("/", checkLogIn, checkAdmin, requestBodyCheck, saveProd)

prodsRoute.put("/:productId", checkLogIn, checkAdmin, requestParamCheck, reqBodyUpdateCheck, updateProd)

prodsRoute.delete("/:productId", checkLogIn, checkAdmin, requestParamCheck, deleteProd)

export default prodsRoute