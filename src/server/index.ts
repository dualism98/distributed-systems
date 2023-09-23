import { Server, Socket } from "socket.io";

import { PORT } from "./constants";
import { authorizeEvalData, evaluateExpression } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";

const server = new Server(PORT);
console.info(`Server listening port ${PORT}`)

const handleEvalData = (socket: Socket, data: Eval.Data) => {
    const {login, expression} = data;

    authorizeEvalData(login);
    const res = evaluateExpression(expression);
    socket.emit(SocketEvents.EVAL_RES, {res, expression});
}

server.on('connection', socket => {
    console.info(`Connection with ${socket.handshake.address}`)
    socket.on(SocketEvents.EVAL, (data: Eval.Data) => {
        console.info(`Got expression from ${socket.handshake.address}`)
        handleEvalData(socket, data);
    })
})
