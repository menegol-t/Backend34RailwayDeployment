import "dotenv/config"
import server from "./services/server"
import {innitMongo} from "./services/database"
import { args } from "./config/arguments"
import cluster from "cluster"
import os from "os"
import { logger } from "./config/logger"

const clusterMode = args.mode == "CLUSTER" ? true : false

const CPUnum = os.cpus().length -2

if(clusterMode && cluster.isPrimary){

    logger.info(`Available CPUs: ${CPUnum}\n Master PID: ${process.pid}`);

    for(let i = 0; i <= CPUnum; i++){
        cluster.fork()
    }

    cluster.on("exit", (worker, code) => {
        logger.info(`Worker ${worker.process.pid} died at ${Date()} with code ${code}`)
        cluster.fork()
    })

}else{

    const innit = async()=>{
        await innitMongo()
        server.listen(args.port, () => logger.info(`Listening ${args.port}\n Worker PID: ${process.pid}`))
    }

    innit()
}



//to pass a port, "npm run dev -- -p 80"