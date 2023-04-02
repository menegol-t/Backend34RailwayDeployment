import { Request, Response, NextFunction } from "express";

export const requestBodyCheck = async (req : Request, res: Response, next: NextFunction) => {

    if(!req.body.title || !req.body.price || !req.body.thumbnail || !req.body.stock || !req.body.description){
        return res.status(401).json({ Error: "Por favor completa los campos 'title', 'price', 'thumbnail', 'stock' y 'description'."})
    }
    if(isNaN(req.body.price) || isNaN(req.body.stock)){
        return res.status(401).json({ Error:  "Los campos 'price' y 'stock' debe ser un numero."})
    }
    next()
}

export const requestParamCheck = async (req : Request, res:Response, next: NextFunction) => {

    if(!req.params.productId){
       return res.status(401).json({ Error: "Se requiere un ID del producto."})
    }
    next()
}

export const reqBody_ProdIdCheck = async (req : Request, res: Response, next: NextFunction) => {

    if(!req.body.productId){
        return res.status(401).json({ Error: "Por favor completa el campo 'productId' en el body para añadir o eliminar ese producto del carrito."})
    }
    next()
}

export const reqBodyUpdateCheck = async (req : Request, res:Response, next: NextFunction) => {

    if(req.body.price && isNaN(req.body.price)){
        return res.status(401).json({ Error:  "El campo 'price' debe ser un numero."})
    }else if(req.body.stock && isNaN(req.body.stock)){
        return res.status(401).json({ Error:  "El campo 'stock' debe ser un numero."})
    }
    next()
}