import math from "mathjs"
import { AuthError } from "./errors"
import { USERS } from "./constants"

export const authorizeEvalData = (login: string): void => {
    if (!USERS.includes(login)) {
        throw new AuthError('Authorization failed. Unknown login')
    }
}

export const evaluateExpression = (expression: string): any => {
    try {
        return math.evaluate(expression);
    } catch (err) {
        throw new EvalError(`Erorr of evaluating expression: ${expression}`)
    }
}