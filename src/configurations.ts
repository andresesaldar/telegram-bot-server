const processStringEnvVariable = (key: string): string | null => {
    const variable = process.env[key]
    return variable && variable.toString() && variable.toString().length > 0
        ? variable.toString()
        : null;
}

export const appDebugModeOn = !!processStringEnvVariable("APP_DEBUG_MODE_ON")
export const appDefaultBotToken: string | null = processStringEnvVariable("APP_DEFAULT_BOT_TOKEN")
