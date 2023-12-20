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

            socket.on(SocketEvents.MESSAGE_SHARE, data => {
                console.info(`Got message ${data.message} from ${socket.handshake.address}`)
                let availableNodes = this.node.nodeTable.filter(node => !data.visitedNodes.includes(node.address))
                if (availableNodes.length === 0) {
                    console.log('No available nodes for share message', this.node.address);
                } else {
                    const randomNodeIndex = Math.floor(Math.random() * availableNodes.length)
                    const targetNode = availableNodes[randomNodeIndex]
                    this.node.tcpClient.shareMessage(targetNode.address, [...data.visitedNodes, this.node.address]);
                }
            });
        })
    }
}

export default TcpServer;
