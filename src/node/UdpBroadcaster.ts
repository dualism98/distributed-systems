import dgram from 'node:dgram';

import Node from './Node';
import SocketEvents from '../common/SocketEvents';
import { UDP_PORT } from '../common/constants';
import { UdpMessage } from '../types/udp';

class UdpBroadcaster {
    socket: dgram.Socket;
    node: Node;

    constructor(node: Node) {
        this.socket = dgram.createSocket('udp4');
        this.node = node;
    }

    initUdpConnection() {
        this.socket.on('message', (msg, rinfo) => {
            const parsedMessage: UdpMessage = JSON.parse(msg.toString());
            switch (parsedMessage.name) {
                case SocketEvents.MONITOR_HANDSHAKE:
                    const {address, name} = this.node;
                    this.socket.send(JSON.stringify({name: SocketEvents.NODE_MONITOR_HANDSHAKE, data: {address, name}}), rinfo.port, rinfo.address);
                    break;
                default:
                    
            }
        });

        this.socket.bind(UDP_PORT, () => {
            this.socket.setBroadcast(true);
            console.info(`Node UDP broadcaster started ${this.node.address}:${UDP_PORT}`)
        })
    }
}

export default UdpBroadcaster;
