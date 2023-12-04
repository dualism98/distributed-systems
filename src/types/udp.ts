import SocketEvents from '../common/SocketEvents'

export interface UdpMessage {
    name: SocketEvents;
    data?: any;
}