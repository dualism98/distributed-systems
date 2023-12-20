import { Socket, io } from "socket.io-client";

import { TCP_PORT } from "../common/constants";
import SocketEvents from "../common/SocketEvents";
import Node from "./Node";

class TcpClient {
    node: Node;
    socket: Socket;

    constructor(node: Node) {
        this.node = node;
        this.socket = io();
    }

    async shareNodeTable(address: string) {
        this.socket = io(`ws://${address}:${TCP_PORT}`)
        
        this.socket.on('connect', () => {
            this.socket.emit(SocketEvents.NODE_TABLE_SHARE, this.node.nodeTable)
        })

        this.socket.on(SocketEvents.NODE_TABLE_SHARE_RESPONSE, nodeTable => {
            console.info('NODE_TABLE_SHARE_RESPONSE socket event');
            this.node.handleNodeTable(nodeTable);
        })

        this.socket.on('connect_error', e => {
            console.info(`Error of connection to ${this.node.address}. ERROR: ${e.message}`)
            this.node.removeNodeRecord(address);
        })
    }

    async shareMessage(address: string, visitedNodes?: string[]) {
        this.socket = io(`ws://${address}:${TCP_PORT}`)
        
        this.socket.on('connect', () => {
            const message = Math.random();
            this.socket.emit(SocketEvents.MESSAGE_SHARE, {
                message,
                visitedNodes: !visitedNodes ? [this.node.address] : visitedNodes,
            })
            console.log(`Send message ${message} from ${this.node.address}`)
        })

        this.socket.on('connect_error', e => {
            console.info(`Error of connection to ${this.node.address}. ERROR: ${e.message}`)
            this.node.removeNodeRecord(address);
        })
    }
}

export default TcpClient;
