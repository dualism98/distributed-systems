import { io } from "socket.io-client";
import { generateMathExpression, getRandomLogin } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";
import { sleep } from "../common/utils";

const socket = io('ws://localhost:3000');

const startSendingOfExpressions = async () => {
    console.log('Begin of sending expressions')
    while (true) {
        const login = getRandomLogin();
        const expression = generateMathExpression();
        socket.emit(SocketEvents.EVAL, {login, expression})
        await sleep(3000);
    }
}


socket.on(SocketEvents.EVAL_RES, (data: Eval.Res) => {
    const {res} = data;
    console.info(`Got result = ${res}`)
})

startSendingOfExpressions();