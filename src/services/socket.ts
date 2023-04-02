import { Server, Socket } from "socket.io";
import { logger } from "../config/logger";
import {saveMsg, getAllMsgs} from "../controllers/chatMsgs"
import {addOrderToCart} from "../controllers/cartMethods"

interface ServerToClientEvents {
    fetchMsgsFromDB: (msgs: any) => void;
    newMsgInDB: (msg: any) => void;
    prodAddedToCart: (order: any) => void;
}

interface ClientToServerEvents {
    postMsgToDB: (msg: any) => void;
    addProdToCart: (order: any) => void;
}

const io = new Server<{}, ServerToClientEvents,{}>

const initWebSocket = (server: any) => {

    io.attach(server);

    io.on("connection", async (socket: Socket<ClientToServerEvents, ServerToClientEvents,{}>) => {

            logger.info("New WS connection");

            socket.emit("fetchMsgsFromDB", await getAllMsgs());
        
            socket.on("postMsgToDB", async (msg: any) => {
                io.emit("newMsgInDB", await saveMsg(msg));
            });

            socket.on("addProdToCart", async(order) => {
                io.emit("prodAddedToCart", await addOrderToCart(order))
            })
    });
};

export default initWebSocket;