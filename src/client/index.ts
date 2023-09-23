import { io } from "socket.io-client";
import dgram from 'dgram';

import { generateMathExpression, getBroadcastAddress, getRandomInt, getRandomLogin } from "./utils";
import SocketEvents from "../common/SocketEvents";
import { Eval } from "../common/types";
import { sleep } from "../common/utils";
import { PORT } from "./constants";

let socketServerAddress: string | null = null; 
let socket = io({
    autoConnect: false
})

const udp = dgram.createSocket('udp4');

const startSignalsSending = async () => {
    while (true) {
        const randomNum = getRandomInt(10);
        switch (true) {
            case randomNum > 0:
                const login = getRandomLogin();
                const expression = generateMathExpression();
                socket.emit(SocketEvents.EVAL, {login, expression});
                break;
            default:
                socket.emit(SocketEvents.STOP);
        }

        await sleep(3000);
    }
}

udp.on('message', (msg, rinfo) => {
    if (msg.toString() !== SocketEvents.SERVER_HANDSHAKE || socketServerAddress) {
        return;
    }

    socketServerAddress = `${rinfo.address}:${rinfo.port}`
    socket = io(`ws://${socketServerAddress}`)
    socket.on(SocketEvents.EVAL_RES, (data: Eval.Res) => {
        const {res} = data;
        console.info(`Got result = ${res}`)
    })
    startSignalsSending();
})

udp.bind(async () => {
    udp.setBroadcast(true);
    console.info(`Client UDP started`)
    const currentAddress = getBroadcastAddress();
    while (!socketServerAddress) {
        udp.send(SocketEvents.CLIENT_HANDSHAKE, PORT, currentAddress)
        await sleep(3000);
    }
});
