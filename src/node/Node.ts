import { getCurrentAddress } from "../common/utils";
import {makeNodeName} from "../common/utils";
import { INode } from "../types/node";
import TcpClient from "./TcpClient";
import TcpServer from "./TcpServer";
import UdpBroadcaster from "./UdpBroadcaster";


class Node {
    name: string;
    nodeTable: INode[];
    address: string;

    udpBroadcaster: UdpBroadcaster;
    tcpClient: TcpClient;
    tcpServer: TcpServer;

    constructor() {
        this.name = makeNodeName(5);
        this.nodeTable = [];
        this.address = getCurrentAddress() ?? '';

        this.udpBroadcaster = new UdpBroadcaster(this);
        this.tcpClient = new TcpClient(this);
        this.tcpServer = new TcpServer(this);
    }

    start() {
        this.udpBroadcaster.initUdpConnection();
        this.tcpServer.start();
        // setInterval(() => {
        //     if (this.nodeTable.length) {
        //         const randomNodeIndex = Math.floor(Math.random() * this.nodeTable.length)
        //         const targetNode = this.nodeTable[randomNodeIndex]
        //         this.tcpClient.shareNodeTable(targetNode.address);
        //     }
        // }, 5000);

        setInterval(() => {
            if (this.nodeTable.length) {
                const randomNodeIndex = Math.floor(Math.random() * this.nodeTable.length)
                const targetNode = this.nodeTable[randomNodeIndex]
                this.tcpClient.shareMessage(targetNode.address);
            }
        }, Math.random() * 10000 + 10000);
    }

    handleNodeTable(nodeTable: INode[]) {
        nodeTable.forEach(node => this.addNodeRecord(node))
    }

    addNodeRecord(node: INode) {
        if (!this.nodeTable.find(savedNode => savedNode.address === node.address) && node.address !== this.address) {
            this.nodeTable.push(node);
            console.info(`Updated node table at ${this.address}. Current table is`, this.nodeTable);
        }
    }

    removeNodeRecord(address: string) {
        this.nodeTable = this.nodeTable.filter(node => node.address !== address);
    }
}

export default Node;
