// import passport from "passport";
// import { UserModel } from "../models/userModel";
// import { Strategy as PassportStrategy } from "passport-strategy";

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

import {IStrategyOptionsWithRequest, Strategy as LocalStrategy} from "passport-local";    
import {UserModel} from "../models/userModel";
import passport from "passport";
    
const StrategyOptionsWithRequest: IStrategyOptionsWithRequest = { usernameField: "username", passwordField: "password", passReqToCallback: true};
    
const logIn = async (req: Express.Request, username: string, password: string, done: (error: any, user?: any, info?: any) => void) => {
    try {
        const user = await UserModel.findOne({ email: username });

        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
        }
        
        const isValid = await user.isValidPassword(password);

        if(!isValid) {
            return done(null, false, { message: "Contraseña incorrecta" });
        }else{
            return done(null, user, { message: "Login correcto" });
        }
    
    } catch (err) {
        return done(err);
    }
};
    
const signup = async (req: Express.Request, username: string, password: string, done: (error: any, user?: any, info?: any) => void) => {
    if (!username || !password) {
        return done(null, false, { message: "Completa los datos" });
    }
    
    try {
        const email = username;
        const userData = { email, password };
        const newUser = await UserModel.create(userData);
        return done(null, newUser);
    } catch (err: any) {
        if (err.code == "11000") {
            return done(null, false, { message: "Ese usuario ya esta en uso." });
        }else{
            return done(null, false, { message: "Error al crear usuario" });
        }
    }
};
    
const loginFunc = new LocalStrategy(StrategyOptionsWithRequest, logIn);
const signUpFunc = new LocalStrategy(StrategyOptionsWithRequest, signup);
    
passport.serializeUser((user: any, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
    
export { loginFunc, signUpFunc };