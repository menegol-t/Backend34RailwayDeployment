"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkLogIn = void 0;
const checkLogIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/api/login");
    }
    next();
};
exports.checkLogIn = checkLogIn;
