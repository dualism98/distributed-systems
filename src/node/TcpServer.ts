import { Server } from "socket.io";
import { TCP_PORT } from "../common/constants";

class TcpServer {
    server: Server;

    constructor() {
        this.server = new Server(TCP_PORT);
    }

    start() {
        this.server.on('connection', (socket) => {
            console.log(`Connection from ${socket.handshake.address}`)
        })
    }
}

export default TcpServer;
