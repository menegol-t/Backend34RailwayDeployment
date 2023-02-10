"use strict";
// import passport from "passport";
// import { UserModel } from "../models/userModel";
// import { Strategy as PassportStrategy } from "passport-strategy";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpFunc = exports.loginFunc = void 0;
// interface IStrategyOptionsWithRequest {
//     usernameField?: string | undefined;
//     passwordField?: string | undefined;
//     session?: boolean | undefined;
//     passReqToCallback: true;
// }
// interface IVerifyOptions {
//     message: string;
// }
// interface VerifyFunctionWithRequest {
//     (
//         req: Request,
//         username: string,
//         password: string,
//         done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void,
//     ): void;
// }
// class Strategy extends PassportStrategy {
//     constructor(options: IStrategyOptionsWithRequest, verify: VerifyFunctionWithRequest){super()};
//     name: string;
// }
// const StrategyOptions: IStrategyOptionsWithRequest = {
//     usernameField: "username",
//     passwordField: "password",
//     passReqToCallback: true
// }
// const login: VerifyFunctionWithRequest = async(req, username, password, done) =>{
//     const user = await UserModel.findOne({username, password})
//     if(!user){
//         return done(null, false, {message: "Las credenciales no son correctas."})
//     }else{
//         return done(null, user)
//     }
// }
// const signup: VerifyFunctionWithRequest = async(req, username, password, done) => {
//     try {
//         const newUser = await UserModel.create({username, password})
//         return done(null, newUser)
//     } catch (err) {
//         console.log("Se rompio todo en el signup de passport-local");
//         console.log(err);
//         return done(null, false, {message: "Error al crear usuario"})
//     }
// }
// export const loginFunc = new Strategy(StrategyOptions, login)
// export const signUpFunc = new Strategy(StrategyOptions, signup)
// passport.serializeUser((user: any, done) =>  {
//     done(null, user._id)
// })
// passport.deserializeUser(async(userId, done) => {
//     await UserModel.findById(userId).then((user)=>{return done(null, user)})
// })
const passport_local_1 = require("passport-local");
const userModel_1 = require("../models/userModel");
const passport_1 = __importDefault(require("passport"));
const StrategyOptionsWithRequest = { usernameField: "username", passwordField: "password", passReqToCallback: true };
const logIn = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.UserModel.findOne({ email: username });
        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
        }
        const isValid = yield user.isValidPassword(password);
        if (!isValid) {
            return done(null, false, { message: "Contraseña incorrecta" });
        }
        else {
            return done(null, user, { message: "Login correcto" });
        }
    }
    catch (err) {
        return done(err);
    }
});
const signup = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (!username || !password) {
        return done(null, false, { message: "Completa los datos" });
    }
    try {
        const email = username;
        const userData = { email, password };
        const newUser = yield userModel_1.UserModel.create(userData);
        return done(null, newUser);
    }
    catch (err) {
        if (err.code == "11000") {
            return done(null, false, { message: "Ese usuario ya esta en uso." });
        }
        else {
            return done(null, false, { message: "Error al crear usuario" });
        }
    }
});
const loginFunc = new passport_local_1.Strategy(StrategyOptionsWithRequest, logIn);
exports.loginFunc = loginFunc;
const signUpFunc = new passport_local_1.Strategy(StrategyOptionsWithRequest, signup);
exports.signUpFunc = signUpFunc;
passport_1.default.serializeUser((user, done) => done(null, user._id));
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.UserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
