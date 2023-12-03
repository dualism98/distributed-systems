import dgram from 'node:dgram';

import Node from './Node';
import SocketEvents from '../common/SocketEvents';
import { UDP_PORT } from '../common/constants';

class UdpBroadcaster {
    socket: dgram.Socket;
    node: Node;

    constructor(node: Node) {
        this.socket = dgram.createSocket('udp4');
        this.node = node;
    }

    initUdpConnection() {
        this.socket.on('message', (msg, rinfo) => {
            switch (msg) {
                default:
                    const {address, name} = this.node;
                    this.socket.send(JSON.stringify({name: SocketEvents.NODE_MONITOR_HANDSHAKE, data: {address, name}}), rinfo.port, rinfo.address);
            }
        });

        this.socket.bind(UDP_PORT, () => {
            this.socket.setBroadcast(true);
            console.info(`Node UDP broadcaster started ${this.node.address}:${UDP_PORT}`)
        })
    }
}

export default UdpBroadcaster;
