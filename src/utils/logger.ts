import {bgCyan, bgYellow, bgRed, bgMagenta, bgWhite} from "chalk"
import {appDebugModeOn} from "../configurations";

export interface Logger {
    info: (component: string, message: string, ...args: any[]) => any;
    alert: (component: string, message: string, ...args: any[]) => any;
    error: (component: string, message: string, ...args: any[]) => any;
    other: (component: string, type: string, message: string, ...args: any[]) => any;
    debug: (component: string, message: string, ...args: any[]) => any;
}

const debug = (
    component: string, message: string , ...args: any[]
): any => {
    if(appDebugModeOn) {
        return processLoggerArguments(
            (resultComponent, resultMessage, ...resultArgs) => {
                return console.log(
                    bgWhite.black(` [${resultComponent.toUpperCase()}][DEBUG] ${resultMessage.toUpperCase()} `),
                    ...resultArgs
                )
            },
            component, message, ...args
        )
    } else {
        return null
    }
}

const info = (
    component: string, message: string , ...args: any[]
): any => {
    return processLoggerArguments(
        (resultComponent, resultMessage, ...resultArgs) => {
            return console.log(
                bgCyan.black(` [${resultComponent.toUpperCase()}][INFO] ${resultMessage.toUpperCase()} `),
                ...resultArgs
            )
        },
        component, message, ...args
    )
}

const alert = (
    component: string, message: string , ...args: any[]
): any => {
    return processLoggerArguments(
        (resultComponent, resultMessage, ...resultArgs) => {
            return console.warn(
                bgYellow.black(` [${resultComponent.toUpperCase()}][ALERT] ${resultMessage.toUpperCase()} `),
                ...resultArgs
            )
        },
        component, message, ...args
    )
}

const error = (
    component: string, message: string , ...args: any[]
): any => {
    return processLoggerArguments(
        (resultComponent, resultMessage, ...resultArgs) => {
            return console.error(
                bgRed.black(` [${resultComponent.toUpperCase()}][ERROR] ${resultMessage.toUpperCase()} `),
                ...resultArgs
            )
        },
        component, message, ...args
    )
}

const other = (
    component: string, type: string, message: string , ...args: any[]
): any => {
    return processOtherLoggerArguments(
        (resultComponent, resultType, resultMessage, ...resultArgs) => {
            return console.log(
                bgMagenta.black(` [${
                    resultComponent.toUpperCase()
                }][${resultType.toUpperCase()}] ${resultMessage.toUpperCase()} `),
                ...resultArgs
            )
        },
        component, type, message, ...args
    )
}

const processLoggerArguments = (
    callback: (component: string, message: string , ...args: any[]) => void,
    component: string, message: string , ...args: any[]
): any => {
    if(component && component.length > 0 && message && message.length > 0) {
        return callback(component, message, ...args)
    } else {
        throw new Error("INVALID LOGGER PARAMETERS")
    }
}

const processOtherLoggerArguments = (
    callback: (component: string, type: string, message: string , ...args: any[]) => any,
    component: string, type: string, message: string , ...args: any[]
): any => {
    if(component && component.length > 0 && message && message.length > 0 && type && type.length > 0) {
        return callback(component, type, message, ...args)
    } else {
        throw new Error("INVALID LOGGER PARAMETERS")
    }
}

export const logger: Logger = {
    info,
    alert,
    error,
    other,
    debug
}
