import { Server, Socket } from "socket.io";
import dgram from 'dgram';

import { PORT } from "./constants";
import { authorizeEvalData, evaluateExpression } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";

const udp = dgram.createSocket('udp4')
const server = new Server(PORT);

const handleEvalData = (socket: Socket, data: Eval.Data) => {
    const {login, expression} = data;

    authorizeEvalData(login);
    const res = evaluateExpression(expression);
    socket.emit(SocketEvents.EVAL_RES, {res, expression});
}

server.on('connection', socket => {
    console.info(`Connection with ${socket.id}`)
    socket.on(SocketEvents.EVAL, (data: Eval.Data) => {
        console.info(`Got expression from ${socket.id}`)
        handleEvalData(socket, data);
    })
})

udp.on('message', (msg, rinfo) => {
    console.info(`Catched broadcast from ${rinfo.address}:${rinfo.port}`)
    udp.send(SocketEvents.SERVER_HANDSHAKE, rinfo.port, rinfo.address);
})

udp.bind(PORT, () => {
    udp.setBroadcast(true);
    console.info(`Server UDP broadcast started on port ${PORT}`)
})
