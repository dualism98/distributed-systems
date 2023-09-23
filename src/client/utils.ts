// @ts-expect-error
import {generateExpression} from 'math-expression-generator'
import {networkInterfaces} from 'os';

import { GenerateExprError } from './errors';
import { USERS } from './constants';


export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  }

export const generateMathExpression = () => {
    const target = getRandomInt(5000);
    const length = getRandomInt(10);

    try {
        let expression = generateExpression({
            target,
            length,
        })

    return expression.join(' ')
    } catch (err) {
        throw new GenerateExprError('Error of generating math expression');
    }
}

export const getRandomLogin = () => {
    return USERS[getRandomInt(USERS.length)];
}

export const getCurrentAddress = () => {
    const network = networkInterfaces()
    const activeInvetrace = network['eth0'] || network[Object.keys(network)[0]];

    return activeInvetrace && activeInvetrace.length > 0 ? activeInvetrace[0].address : undefined
}

export const getBroadcastAddress = () => {
    const currentAddress = getCurrentAddress();
    if (currentAddress) {
        let udpBroadcastAddress = currentAddress?.split('.')
        udpBroadcastAddress[2] = '255'
        udpBroadcastAddress[3] = '255'
    
        return udpBroadcastAddress?.join('.');
    }
}