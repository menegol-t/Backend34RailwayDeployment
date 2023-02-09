const {saveMsg, getAllMsgs} = require("../controllers/chatMsgs")
const socketIo = require("socket.io")

let io

const innitWebSocket = (server) => {
    io = socketIo(server)
    io.on("connection", async (socket) => {

        console.log("New WS connection");
        
        socket.emit("fetchMsgsFromDB", await getAllMsgs())

        socket.on("postMsgToDB", async (msg) => {
            
            io.emit("newMsgInDB", await saveMsg(msg))
        })
    })
}

module.exports = innitWebSocket 