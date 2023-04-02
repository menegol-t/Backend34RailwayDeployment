import { Request, Response, NextFunction } from "express";
import { CartModel } from "../models/cartsModel";
import { ProductsModel } from "../models/prodsModel";
import { logger } from "../config/logger";

export const getAllCarts = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const carts = await CartModel.find()
        res.send(carts)
    } catch (err) {
        logger.error(err)
        next(err)
    }
}

export const getCartById = async (req: Request, res: Response, next: NextFunction) => {
    try {
         
        const {cartId} = req.params
        const cart = await CartModel.findById(cartId)

        if(!cart){
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            })
        }else{
            res.send(cart)
        }

    } catch (err) {
        logger.error(err)
        next(err)
    }
}

export const getProdsInsideCartId = async (req: Request, res: Response, next: NextFunction) =>{
    try {

        const cart:any = await getCartById(req, res, next)
        res.send(cart.products)

    } catch (err) {
        if(err instanceof Error){
            res.status(500).json({
                msg: "Get products in cart error",
                error: err
            })
        }else{
            next(err)
        }
    }
}

export const createCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const newCart = await CartModel.create({products: []})
        res.send(`Cart created: ${newCart}`)

    } catch (err) {
        if(err instanceof Error){
            res.status(500).json({
                msg: "Create cart error",
                error: err
            })
        }else{
            next(err)
        }
    }
}

export const deleteCartById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const {cartId} = req.params
        await CartModel.findByIdAndDelete(cartId)
        res.send(`Cart with ID ${cartId} deleted.`)

    } catch (err) {
        logger.error(err)
        next(err)
    }
}

export const addProdToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {productId} = req.body
        const prod = await ProductsModel.findById(productId)        
        const cartToUpdate:any = await getCartById(req, res, next)        
        const {products} = cartToUpdate
        const {cartId} = req.params

        if(!prod){
            res.status(400).json({
                msg: "No se encontro ningun producto con ese ID"
            })
        }else if(!cartToUpdate){
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            })
        }else{
            products.push(prod)
        
            const CartProdsToUpdate = await CartModel.findByIdAndUpdate(
                cartId,
                {products},
                {new: true}
            )

            res.send(`Cart changed: ${CartProdsToUpdate}`)
        }

    } catch (err) {
        if(err instanceof Error){
            res.status(500).json({
                msg: "Add product to cart error",
                error: err
            })
        }else{
            next(err)
        }        
    }
}

export const deleteProdFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const {productId} = req.body
        const prod = await ProductsModel.findById(productId)        
        const cartToUpdate:any = await getCartById(req, res, next)        
        const {products} = cartToUpdate
        const {cartId} = req.params
        

        if(!prod){
            res.status(400).json({
                msg: "Ese producto no esta en el carro"
            })
        }else if(!cartToUpdate){
            res.status(400).json({
                msg: "No se encontro ningun cart con ese ID"
            })
        }else{
            removeProdById(products, productId)

            const CartProdsToUpdate = await CartModel.findByIdAndUpdate(
                cartId,
                {products},
                {new: true}
            )

            res.send(`Cart changed: ${CartProdsToUpdate}`)
        }

    } catch (err) {
        if(err instanceof Error){
            res.status(500).json({
                msg: "Delete product from cart error",
                error: err
            })
        }else{
            next(err)
        }
    }
}

function removeProdById(arr: [], id: string) {
    const indexOfProd = arr.findIndex((obj: any) => obj._id == id);
  
    if (indexOfProd > -1) {
      arr.splice(indexOfProd, 1);
    }
  
    return arr;
}