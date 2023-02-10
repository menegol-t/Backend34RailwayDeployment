"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../config/logger");
const random = () => Math.floor(Math.random() * (1000 - 1 + 1) + 1);
let finalMsg = {};
process.on("message", (msg) => {
    let loopNumber;
    if (msg == undefined || isNaN(parseInt(msg))) {
        loopNumber = 100000000;
    }
    else {
        loopNumber = msg;
    }
    for (let i = 0; i < loopNumber; i++) {
        let specialNum = random();
        if (finalMsg[specialNum]) {
            finalMsg[specialNum] = finalMsg[specialNum] + 1;
        }
        else {
            finalMsg[specialNum] = 1;
        }
    }
    logger_1.logger.info(`Time waster PID: ${process.pid}`);
    process.send(finalMsg);
});
