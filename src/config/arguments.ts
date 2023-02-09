import minimist from "minimist"

const optionalArgsObj = {
    alias: {
        p: "port",
        m: "mode"
    },
    default: {
        port: 8080,
        mode: "FORK"
    }
}

export const args = minimist(process.argv.slice(2), optionalArgsObj)