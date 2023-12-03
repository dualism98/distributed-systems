import dgram from 'node:dgram';

import { getBroadcastAddress, sleep } from '../common/utils';
import SocketEvents from '../common/SocketEvents';
import { UDP_PORT } from '../common/constants';
import { INode } from '../types/node';
import { UdpMessage } from '../types/udp'; 

class Monitor {
    socket: dgram.Socket;
    nodes: INode[];

    constructor() {
        this.socket = dgram.createSocket('udp4');
        this.nodes = [];
    }

    startBroadcast(){ 
        this.socket.on('message', (msg, rinfo) => {
            console.info(`Catched message from node: ${rinfo.address}:${rinfo.port}`)
            const message: UdpMessage = JSON.parse(msg.toString());
            if (message.name === SocketEvents.NODE_MONITOR_HANDSHAKE && !this.nodes.find(node => node.address === rinfo.address)) {
                this.nodes.push(message.data)
                console.info('Monitor nodes list updated', this.nodes);
            }
        });

        this.socket.bind(async () => {
            this.socket.setBroadcast(true);
            const currentAddress = getBroadcastAddress();
            console.info(`Monitor utility UDP broadcast started: ${currentAddress}:${UDP_PORT}`);
            while (true) {
                this.socket.send(SocketEvents.MONITOR_HANDSHAKE, UDP_PORT, currentAddress)
                await sleep(3000);
            }
        });
    }
}


export default Monitor;
