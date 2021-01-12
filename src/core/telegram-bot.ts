import {Telegraf} from "telegraf";
import {logger} from "../utils";
import {appDebugModeOn} from "../configurations";

const componentName = "telegram bot";

export class TelegramBot {

    private readonly token: string;
    private bot: Telegraf | null;
    private started: boolean;

    public get botId(): number | undefined {
        return this.bot?.botInfo?.id
    }

    constructor(token: string) {
        this.bot = null;
        this.started = false
        this.token = token;
    }

    public async start(): Promise<TelegramBot> {
        this.validateIfBotIsNotStarted();
        this.bot = new Telegraf(this.token);
        logger.info(componentName, `starting new telegram bot`);
        this.configureDebugMiddleware();
        this.listenBotMessages();
        await this.bot.launch();
        this.started = true;
        logger.info(componentName, `telegram bot with id ${this.botId} started`);
        return this;
    }

    public stop(reason?: string): TelegramBot {
        this.validateIfBotIsStarted();
        logger.info(componentName, `stopping telegram bot with id: ${this.botId}`);
        (this.bot as Telegraf).stop(reason)
        this.started = false;
        return this;
    }

    private configureDebugMiddleware(): void {
        if(appDebugModeOn) {
            (this.bot as Telegraf).use(async (ctx, next) => {
                const start = Date.now();
                await next();
                logger.debug(componentName, `Response time: ${Date.now() - start}ms`)
            });
        }
    }

    private listenBotMessages() {
        (this.bot as Telegraf).on('text', (ctx) => ctx.reply('Hello World'))
    }

    private validateIfBotIsStarted(): void {
        if(!this.started || !this.bot) {
            throw new Error("TELEGRAM BOT IS NOT STARTED")
        }
    }

    private validateIfBotIsNotStarted(): void {
        if(this.started) {
            throw new Error("TELEGRAM BOT IS ALREADY STARTED")
        }
    }

}
