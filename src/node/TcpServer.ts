import { Server } from "socket.io";

import { TCP_PORT } from "../common/constants";
import Node from "./Node";
import SocketEvents from "../common/SocketEvents";

class TcpServer {
    node: Node;
    server: Server;

    constructor(node: Node) {
        this.node = node;
        this.server = new Server(TCP_PORT);
    }

    start() {
        this.server.on('connection', (socket) => {
            console.log(`Connection from ${socket.handshake.address}`)
            socket.on(SocketEvents.NODE_TABLE_SHARE, nodeTable => {
                console.info('NODE_TABLE_SHARE socket event');
                this.node.handleNodeTable(nodeTable);
                this.server.emit(SocketEvents.NODE_TABLE_SHARE_RESPONSE, this.node.nodeTable)
            })
        })
    }
}

export default TcpServer;
