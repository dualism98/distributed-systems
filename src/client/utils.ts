// @ts-expect-error
import {generateExpression} from 'math-expression-generator'
import { GenerateExprError } from './errors';
import { USERS } from './constants';

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
  }

export const generateMathExpression = () => {
    const target = getRandomInt(5000);
    const length = getRandomInt(50);

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