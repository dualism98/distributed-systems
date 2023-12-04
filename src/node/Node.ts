import { getCurrentAddress } from "../common/utils";
import {makeNodeName} from "../common/utils";
import { INode } from "../types/node";


class Node {
    name: string;
    nodeTable: INode[];
    address: string;

    constructor() {
        this.name = makeNodeName(5);
        this.nodeTable = [];
        this.address = getCurrentAddress() ?? '';
    }

    addNodeRecord(node: INode) {
        if (!this.nodeTable.find(savedNode => savedNode.address === node.address) && node.address !== this.address) {
            this.nodeTable.push(node);
            console.info(`Updated node table at ${this.address}. Current table is`, this.nodeTable);
        }
    }
}

export default Node;
