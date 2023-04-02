"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrderToCart = exports.finishCartByOwner = exports.createCartLogin = exports.getProdsInsideCartOwner = exports.getCartByOwner = void 0;
const cartsModel_1 = require("../models/cartsModel");
const prodsModel_1 = require("../models/prodsModel");
const logger_1 = require("../config/logger");
const utils = __importStar(require("util"));
const smsAndWhatsap_1 = require("../services/smsAndWhatsap");
const email_1 = require("../services/email");
const getCartByOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield cartsModel_1.CartModel.findOne({ owner: owner, done: false });
    }
    catch (err) {
        logger_1.logger.error(`Error al buscar cart por owner `, err);
        return false;
    }
});
exports.getCartByOwner = getCartByOwner;
const getProdsInsideCartOwner = (ownerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield (0, exports.getCartByOwner)(ownerEmail);
        if (cart == false) {
            return false;
        }
        else {
            return cart.products;
        }
    }
    catch (err) {
        logger_1.logger.error(`Error al obtener productos dentro de Cart por Owner `, err);
        return false;
    }
});
exports.getProdsInsideCartOwner = getProdsInsideCartOwner;
const checkIfCartAlreaydCreated = (ownerEmail, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cart = yield cartsModel_1.CartModel.findOne({ owner: ownerEmail, done: false });
        return cart;
    }
    catch (err) {
        logger_1.logger.error(`Error al chequear si el cart ya estaba creado `, err);
        next(err);
    }
});
const createCartLogin = (ownerEmail, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const didUserAlreadyHaveACart = yield checkIfCartAlreaydCreated(ownerEmail, next);
        if (didUserAlreadyHaveACart) {
            return didUserAlreadyHaveACart;
        }
        else {
            try {
                const newCart = yield cartsModel_1.CartModel.create({ products: [], owner: ownerEmail, done: false });
                return newCart;
            }
            catch (err) {
                logger_1.logger.error(`Error al crear nuevo cart `, err);
                next(err);
            }
        }
    }
    catch (err) {
        logger_1.logger.error(`Error al crear cart en el login `, err);
        next(err);
    }
});
exports.createCartLogin = createCartLogin;
const finishCartByOwner = (owner) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartToUpdate = yield (0, exports.getCartByOwner)(owner.email);
        const cartId = cartToUpdate._id;
        if (!cartToUpdate) {
            logger_1.logger.error("No se encontro ningun cart con ese ID");
            return false;
        }
        else {
            const done = true;
            const cartToBeFinished = yield cartsModel_1.CartModel.findByIdAndUpdate(cartId, { done }, { new: true });
            if (cartToBeFinished) {
                let prodsItems = "";
                for (let i = 0; i < cartToBeFinished.products.length; i++) {
                    prodsItems +=
                        "<li>" + cartToBeFinished.products[i].title + "<ul> <li>ProdID: " + cartToBeFinished.products[i]._id + "</li> <li> Precio: " + cartToBeFinished.products[i].price + "</li> <li>Cantidad: " + cartToBeFinished.products[i].quantity + "</li> </ul> </li>";
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
                };
                try {
                    yield email_1.transporter.sendMail(mailOptions);
                    // await sendSms(process.env.ADMIN_PHONE, `${owner.email} made an order.`)
                    yield (0, smsAndWhatsap_1.sendWhatsapp)(process.env.ADMIN_PHONE, `Nuevo pedido numero "${cartToBeFinished._id}" de ${owner.email}, ${owner.name}`);
                    yield (0, smsAndWhatsap_1.sendWhatsapp)(owner.phone, `${owner.name}, recibimos tu pedido numero "${cartToBeFinished._id}" y ya esta en proceso.`);
                }
                catch (err) {
                    logger_1.logger.error("Error al enviar informacion de cart via email, SMS y Whatsapp.", err);
                    return false;
                }
            }
        }
    }
    catch (err) {
        logger_1.logger.error(`Error al obtener cartByOwner `, err);
        return false;
    }
});
exports.finishCartByOwner = finishCartByOwner;
const addOrderToCart = (order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { owner, prodId } = order;
        const prod = yield prodsModel_1.ProductsModel.findById(prodId);
        const cartToUpdate = yield (0, exports.getCartByOwner)(owner);
        const { products } = cartToUpdate;
        const cartId = cartToUpdate._id;
        const indexOfDuplicatedItem = products.findIndex((itemInTheCart) => itemInTheCart._id == prodId);
        if (!prod) {
            logger_1.logger.error("No se encontro ningun producto con ese ID");
            return false;
        }
        else if (!cartToUpdate) {
            logger_1.logger.error("No se encontro ningun cart con ese ID");
            return false;
        }
        else {
            if (indexOfDuplicatedItem !== -1) {
                prod.quantity = prod.quantity + 1;
                products[indexOfDuplicatedItem] = prod;
            }
            else {
                products.push(prod);
            }
            yield cartsModel_1.CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            return true;
        }
    }
    catch (err) {
        logger_1.logger.error(utils.inspect(err, true, 7, true));
        return false;
    }
});
exports.addOrderToCart = addOrderToCart;
