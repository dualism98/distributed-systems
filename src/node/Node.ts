import { getCurrentAddress } from "../common/utils";
import makeNodeName from "../utils/makeNodeName";


class Node {
    name: string;
    nodeTable: string[];
    address: string;

    constructor() {
        this.name = makeNodeName(5);
        this.nodeTable = [];
        this.address = getCurrentAddress() ?? '';
    }
}

export default Node;
