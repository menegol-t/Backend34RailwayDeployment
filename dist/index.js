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
require("dotenv/config");
const server_1 = __importDefault(require("./services/server"));
const database_1 = require("./services/database");
const arguments_1 = require("./config/arguments");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const logger_1 = require("./config/logger");
const clusterMode = arguments_1.args.mode == "CLUSTER" ? true : false;
const CPUnum = os_1.default.cpus().length - 2;
if (clusterMode && cluster_1.default.isPrimary) {
    logger_1.logger.info(`Available CPUs: ${CPUnum}\n Master PID: ${process.pid}`);
    for (let i = 0; i <= CPUnum; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code) => {
        logger_1.logger.info(`Worker ${worker.process.pid} died at ${Date()} with code ${code}`);
        cluster_1.default.fork();
    });
}
else {
    const innit = () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, database_1.innitMongo)();
        server_1.default.listen(arguments_1.args.port, () => logger_1.logger.info(`Listening ${arguments_1.args.port}\n Worker PID: ${process.pid}`));
    });
    innit();
}
//to pass a port, "npm run dev -- -p 80"
