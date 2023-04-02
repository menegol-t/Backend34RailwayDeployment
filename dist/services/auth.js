"use strict";
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
const passport_local_1 = require("passport-local");
const userModel_1 = require("../models/userModel");
const passport_1 = __importDefault(require("passport"));
const logger_1 = require("../config/logger");
const StrategyOptionsWithRequest = { usernameField: "username", passwordField: "password", passReqToCallback: true };
function validateEmail(mail) {
    const isRealEmail = /\S+@\S+\.\S+/;
    return isRealEmail.test(mail);
}
const logIn = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.UserModel.findOne({ email: username });
        if (!user) {
            return done(null, false, { message: "Credenciales invalidas." });
        }
        const isValid = yield user.isValidPassword(password);
        if (!isValid) {
            return done(null, false, { message: "Credenciales invalidas." });
        }
        else {
            return done(null, user, { message: "Login correcto." });
        }
    }
    catch (err) {
        logger_1.logger.error(`Error al crear usuario L26 SRC/SERVICES/AUTH `, err);
        return done(err);
    }
});
//aca el tipo de req es Express.Request 
const signup = (req, username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, location, age, phone, profileThumbnail } = req.body;
    const telephone = phone.split(' ').join('');
    const signUpData = [username, password, name, location, age, telephone, profileThumbnail];
    const missingSomeInfo = signUpData.some(item => item == undefined || item == '' || item == null || item == false);
    //cambiar a switch statement
    if (missingSomeInfo) {
        return done(null, false, { message: "Completa todos los datos." });
    }
    else if (isNaN(age) || isNaN(telephone)) {
        return done(null, false, { message: "Asegurate de que la edad sea un numero, y el telefono contenga unicamente numeros, sin espacios ni simbolos." });
    }
    else if (telephone.length > 15 || telephone.length < 8) {
        return done(null, false, { message: "El numero de telefono debe tener 8 caracteres como minimo y 15 como maximo." });
    }
    else if (age.length > 2) {
        return done(null, false, { message: "Ingresa una edad real." });
    }
    else if (age < 18) {
        return done(null, false, { message: "Tienes que tener mas de 18 años para usar esta app." });
    }
    else if (!validateEmail(username)) {
        return done(null, false, { message: "Por favor ingresa un email real." });
    }
    try {
        const email = username;
        const userData = { email, password, name, location, age, phone, profileThumbnail };
        const newUser = yield userModel_1.UserModel.create(userData);
        return done(null, newUser);
    }
    catch (err) {
        if (err.code == "11000") {
            return done(null, false, { message: "Ese email ya esta en uso." });
        }
        else {
            logger_1.logger.error(`Error al crear usuario L52 SRC/SERVICES/AUTH`, err);
            return done(null, false, { message: "Error al crear usuario." });
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
        logger_1.logger.error(`Error al deserializar user id  L68 SRC/SERVICES/AUTH`, err);
        done(err);
    }
}));
