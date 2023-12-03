import Node from "./Node";
import UdpBroadcaster from "./UdpBroadcaster";


const node = new Node();
const udpBroadcaster = new UdpBroadcaster(node);
udpBroadcaster.initUdpConnection();
