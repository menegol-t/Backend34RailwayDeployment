import { NextFunction } from "express";
import { CartModel } from "../models/cartsModel";
import { ProductsModel } from "../models/prodsModel";
import { logger } from "../config/logger";
import* as utils from "util"
import { sendSms, sendWhatsapp } from "../services/smsAndWhatsap";
import {transporter} from "../services/email"

export const getCartByOwner = async (owner: string) => {
    try {
        return await CartModel.findOne({owner: owner, done: false})
    } catch (err) {
        logger.error(`Error al buscar cart por owner `, err)
        return false
    }
}

export const getProdsInsideCartOwner = async (ownerEmail: string) =>{
    try {
        const cart:any = await getCartByOwner(ownerEmail)
        if (cart == false) {
            return false
        } else {
            return cart.products
        }   
    } catch (err) {
        logger.error(`Error al obtener productos dentro de Cart por Owner `,err)
        return false
    }
}

const checkIfCartAlreaydCreated = async (ownerEmail: string, next: NextFunction) => {
    try {
        const cart = await CartModel.findOne({owner: ownerEmail, done: false})
        return cart
    } catch (err) {
        logger.error(`Error al chequear si el cart ya estaba creado `,err)
        next(err)
    }
}

export const createCartLogin = async (ownerEmail, next: NextFunction) => {
    try {
        const didUserAlreadyHaveACart = await checkIfCartAlreaydCreated(ownerEmail, next)

        if(didUserAlreadyHaveACart){
            return didUserAlreadyHaveACart
        }else{
            try{
                const newCart = await CartModel.create({products: [], owner: ownerEmail, done: false})
                return newCart
            }catch(err){
                logger.error(`Error al crear nuevo cart `, err)
                next(err)
            }
        }
    } catch (err) {
        logger.error(`Error al crear cart en el login `, err)
        next(err)
    }
}

export const finishCartByOwner = async (owner: any) => {
    try {       
        const cartToUpdate:any = await getCartByOwner(owner.email) 
        const cartId = cartToUpdate._id

        if(!cartToUpdate){
            logger.error("No se encontro ningun cart con ese ID")
            return false
        }else{
            const done = true
            const cartToBeFinished:any = await CartModel.findByIdAndUpdate(cartId, {done}, {new: true})
            
            if(cartToBeFinished){

                let prodsItems:string = ""

                for (let i=0; i < cartToBeFinished.products.length; i++){
                    prodsItems += 
                        "<li>" + cartToBeFinished.products[i].title + "<ul> <li>ProdID: " + cartToBeFinished.products[i]._id + "</li> <li> Precio: " + cartToBeFinished.products[i].price + "</li> <li>Cantidad: " + cartToBeFinished.products[i].quantity + "</li> </ul> </li>"
                }
                
                const mailOptions = {
                    from: process.env.ETHEREAL_EMAIL,
                    to: process.env.ETHEREAL_EMAIL,
                    subject: `Nuevo pedido de ${owner.name}, ${owner.email}`,
                    html: `
                    <h1>Nuevo pedido. CartID: ${cartToBeFinished._id}</h1>
                    <h2> Informacion del usuario: </h2>
                    <ul>
                        <li>UserID: ${owner._id}</li>
                        <li>Email: ${owner.email}</li>
                        <li>Name: ${owner.name}</li>
                        <li>Phone: ${owner.phone}</li>
                        <li>Location: ${owner.location}</li>
                        <li>Age: ${owner.age}</li>
                    </ul>
                    <h3>Productos:</h3>
                    <ol>
                        ${prodsItems}
                    </ol>
                    `
                }
    
                try {
                    await transporter.sendMail(mailOptions)
                    // await sendSms(process.env.ADMIN_PHONE, `${owner.email} made an order.`)
                    await sendWhatsapp(process.env.ADMIN_PHONE, `Nuevo pedido numero "${cartToBeFinished._id}" de ${owner.email}, ${owner.name}`)
                    await sendWhatsapp(owner.phone, `${owner.name}, recibimos tu pedido numero "${cartToBeFinished._id}" y ya esta en proceso.`)
                }catch(err){
                    logger.error("Error al enviar informacion de cart via email, SMS y Whatsapp.", err)
                    return false
                } 
            } 
        }
    } catch (err) {
        logger.error(`Error al obtener cartByOwner `, err)
        return false
    }
}

export const addOrderToCart = async (order) => {
    try {
        const {owner, prodId} = order
        const prod = await ProductsModel.findById(prodId)
        const cartToUpdate:any = await getCartByOwner(owner)

        const {products} = cartToUpdate
        const cartId = cartToUpdate._id
        const indexOfDuplicatedItem = products.findIndex((itemInTheCart) => itemInTheCart._id == prodId)

        if(!prod){
            logger.error("No se encontro ningun producto con ese ID")
            return false
        }else if(!cartToUpdate){
            logger.error("No se encontro ningun cart con ese ID")
            return false
        }else{ 
            
            if(indexOfDuplicatedItem !== -1){
                prod.quantity = prod.quantity + 1
                products[indexOfDuplicatedItem] = prod
            }else{
                products.push(prod)
            }

            await CartModel.findByIdAndUpdate(cartId, {products}, {new: true})
            return true
        }
    } catch (err) {
        logger.error(utils.inspect(err, true, 7, true))       
        return false
    }
}