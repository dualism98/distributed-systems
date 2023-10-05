import { Server, Socket } from "socket.io";
import dgram from 'dgram';

import { PORT } from "./constants";
import { authorizeEvalData, evaluateExpression } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";
import { sleep } from "../common/utils";

const udp = dgram.createSocket('udp4');

let isActive = true;
const server = new Server(PORT);

const handleEvalData = async (socket: Socket, data: Eval.Data) => {
    const {login, expression} = data;

    authorizeEvalData(login);
    const res = evaluateExpression(expression);
    await sleep(1000);
    socket.emit(SocketEvents.EVAL_RES, {res, expression});
}

server.on('connection', socket => {
    console.info(`Connection with ${socket.id}`)

    socket.on(SocketEvents.EVAL, (data: Eval.Data) => {
        if (!isActive) {
            return;
        }

        console.info(`Got expression from ${socket.id}. ${data.expression}`)
        handleEvalData(socket, data);
    })
    
    socket.on(SocketEvents.STOP, () => {
        if (isActive) {
            console.info('SERVER STOPPED')
            isActive = false;
        }
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
