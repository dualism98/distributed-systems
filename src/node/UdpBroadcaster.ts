import dgram from 'node:dgram';

import Node from './Node';
import SocketEvents from '../common/SocketEvents';
import { UDP_PORT } from '../common/constants';
import { UdpMessage } from '../types/udp';
import { getBroadcastAddress, getCurrentAddress } from '../common/utils';

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
                    console.info(`Got monitor handshake from ${rinfo.address}`);
                    var {address, name} = this.node;
                    this.socket.send(JSON.stringify({name: SocketEvents.NODE_MONITOR_HANDSHAKE, data: {address, name}}), rinfo.port, rinfo.address);
                    break;
                case SocketEvents.NODE_BROADCAST:
                    console.info(`Got node broadcast from ${rinfo.address}`);
                    var {address, name} = this.node;
                    this.socket.send(JSON.stringify({name: SocketEvents.NODE_BROADCAST_RESPONSE, data: {address, name}}), rinfo.port, rinfo.address);
                    break;
                case SocketEvents.NODE_BROADCAST_RESPONSE:
                    if (this.node.address === rinfo.address) {
                        break;
                    }
                    console.info(`Got node broadcast response from ${rinfo.address}`);
                    this.node.addNodeRecord(parsedMessage.data);
                    break;
                default:
                    
            }
        });

        this.socket.bind(UDP_PORT, () => {
            this.socket.setBroadcast(true);
            console.info(`Node UDP broadcaster started ${this.node.address}:${UDP_PORT}`)
            const message: UdpMessage = {name: SocketEvents.NODE_BROADCAST}
            this.socket.send(JSON.stringify(message), UDP_PORT, getBroadcastAddress())
        })
    }
}

export default UdpBroadcaster;
