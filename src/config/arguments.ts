import minimist from "minimist"

const usingPort = process.env.PORT || 8080

const optionalArgsObj = {
    alias: {
        p: "port",
        m: "mode"
    },
    default: {
        port: usingPort,
        mode: "FORK"
    }
}

export const args = minimist(process.argv.slice(2), optionalArgsObj)