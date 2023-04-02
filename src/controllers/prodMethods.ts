import { Request, Response, NextFunction } from "express";
import { ProductsModel } from "../models/prodsModel";
import { logger } from "../config/logger";

export const getAllProd = async (req: any, res: Response, next: NextFunction) => {
    try {
        const allProds = await ProductsModel.find()
        res.render("home.pug", {prodData: allProds, usrEmail: req.user.email})
    } catch (err) {
        logger.error(`Error al buscar todos los productos en la DB`, err)
        next()
    }
}

export const getProdById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {productId} = req.params
        const prod = await ProductsModel.findById(productId)

        if(!prod){
            res.status(400).json({
                msg: "No se encontro ningun producto con ese ID"
            })
        }else{
            res.render("home.pug", {prodById: prod})
        }

    } catch (err) {
        logger.error(`Error searching prods by ID`, err)
        next()
    }
}

export const saveProd = async (req: Request, res: Response, next: NextFunction) => {
    try { 
        const {title, price, thumbnail, thumbnail2, stock, description, alt, category} = req.body
        const newProd = await ProductsModel.create({title, price, thumbnail, thumbnail2, stock, description, alt, category})
        res.send(`Succesfully saved: \n ${newProd}`)
    } catch (err) {
        logger.error(`Error saving produt to DB`, err) 
        next()      
    }
}

export const updateProd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {productId} = req.params
        const valuesToUpdate:any  = {}

        for(let [key, value] of Object.entries(req.body)){
            if(value !== undefined){
                valuesToUpdate[key] = value;
            }
        }
        
        const prodToUpdate = await ProductsModel.findByIdAndUpdate(
            productId,
            valuesToUpdate,
            {new: true}
        )

        res.send(`Update succesful: \n ${prodToUpdate}`)
    } catch (err) {
        logger.error(`Erro actualizando producto:`, err)
        next()       
    }
}

export const deleteProd = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const {productId} = req.params
        await ProductsModel.findByIdAndDelete(productId)
        res.send(`Product with ID ${productId} deleted`)

    } catch (err) {
        logger.error(`Error deleting prod form DB`, err)     
    }
}