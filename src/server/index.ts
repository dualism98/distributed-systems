import { Server, Socket } from "socket.io";

import { PORT } from "./constants";
import { authorizeEvalData, evaluateExpression } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";

const io = new Server(PORT);

const handleEvalData = (socket: Socket, data: Eval.Data) => {
    const {login, expression} = data;

    authorizeEvalData(login);
    const res = evaluateExpression(expression);
    socket.emit(SocketEvents.EVAL_RES, {res});
}

io.on('connection', socket => {
    socket.on(SocketEvents.EVAL, (data: Eval.Data) => {
        handleEvalData(socket, data);
    })
})