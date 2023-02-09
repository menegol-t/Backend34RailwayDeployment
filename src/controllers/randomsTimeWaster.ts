import { logger } from "../config/logger"

const random = () => Math.floor(Math.random() * (1000 - 1 + 1) + 1)

let finalMsg = {}

process.on("message", (msg: any) => {
    
    let loopNumber

    if(msg == undefined || isNaN(parseInt(msg))){
        loopNumber = 100000000
    }else{
        loopNumber = msg
    }

    for(let i  = 0; i<loopNumber; i++){
        let specialNum = random()
        if(finalMsg[specialNum]){
            finalMsg[specialNum] = finalMsg[specialNum] + 1
        }else{
            finalMsg[specialNum] = 1
        }
    }
    
    logger.info(`Time waster PID: ${process.pid}`);
    process.send(finalMsg)
})