import winston, {format} from "winston";
const {combine, printf, timestamp, colorize} = format

const logConfiguration = {
    format: combine(
        timestamp({
            format: "DD-MMM-YYYY HH:mm:ss"
        }),
        colorize(),
        printf((info) => `${info.level} | ${[info.timestamp]} | ${info.message}`)
    ),
    transports : [
        new winston.transports.Console({ level:'info' }),
        new winston.transports.File({ filename: './logs/warn.log', level:'warn' }),
        new winston.transports.File({ filename: './logs/error.log', level:'error' }),
    ]
}

export const logger = winston.createLogger(logConfiguration)   