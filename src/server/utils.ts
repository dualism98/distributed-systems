import { AuthError } from "./errors"
import { USERS } from "./constants"

export const authorizeEvalData = (login: string): void => {
    if (!USERS.includes(login)) {
        console.error(`Authorization failed. Unknown login "${login}"`)
        new AuthError(`Authorization failed. Unknown login "${login}"`)
    }
}

export const evaluateExpression = (expression: string): any => {
    try {
        const math = require('mathjs');
        return math.evaluate(expression);
    } catch (err) {
        console.error(`Error of evaluating expression`)
        throw new EvalError(`Error of evaluating expression`)
    }
}