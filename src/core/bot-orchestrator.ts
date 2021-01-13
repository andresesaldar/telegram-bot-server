import {logger} from "../utils";
import {TelegramBot} from "./telegram-bot";
import {appDefaultBotToken} from "../configurations";

const componentName = "bot orchestrator";

export class BotOrchestrator {

    private static _instance: BotOrchestrator;

    private readonly telegramBots: TelegramBot[];
    private started: boolean;

    private constructor() {
        this.telegramBots = [];
        this.started = false;
    }

    public static instance(): BotOrchestrator {
        return this._instance || (this._instance = new this())
    }

    public async start(): Promise<BotOrchestrator> {
        this.validateIfOrchestratorIsNotStarted();
        logger.info(componentName, "starting bot orchestrator")
        this.started = true;
        await this.startDefaultBot();
        return this;
    }

    public stop(reason?: string): BotOrchestrator {
        this.validateIfOrchestratorIsStarted();
        logger.info(componentName, "stopping bot orchestrator")
        for(const bot of this.telegramBots) {
            if(bot.botId) {
                this.stopAndRemoveTelegramBot(bot.botId, reason)
            }
        }
        this.started = false;
        return this;
    }

    public async startNewTelegramBot(token: string): Promise<TelegramBot> {
        this.validateIfOrchestratorIsStarted();
        const bot = await new TelegramBot(token).start()
        if(bot.botId) {
            logger.alert(componentName, "searching for telegram bot with the same id")
            this.stopAndRemoveTelegramBot(bot.botId)
                ? logger.alert(componentName, "removed telegram bot with the same id")
                : logger.alert(componentName, "telegram bot with the same id not found");
        }
        this.telegramBots.push(bot);
        return bot;
    }

    private async startDefaultBot(): Promise<void> {
        if(appDefaultBotToken) {
            logger.info(componentName, "starting default telegram bot")
            await this.startNewTelegramBot(appDefaultBotToken);
        }
    }

    private stopAndRemoveTelegramBot(id: number, reason?: string): boolean {
        const existentBot = this.telegramBots.find((toFind) => toFind.botId === id)
        if(existentBot) {
            existentBot.stop(reason);
            this.telegramBots.splice(
                this.telegramBots.indexOf(existentBot),
                1
            )
            return true;
        } else {
            return false;
        }
    }

    private validateIfOrchestratorIsNotStarted(): void {
        if(this.started) {
            throw new Error("BOT ORCHESTRATOR IS ALREADY STARTED")
        }
    }

    private validateIfOrchestratorIsStarted(): void {
        if(!this.started) {
            throw new Error("BOT ORCHESTRATOR IS NOT STARTED")
        }
    }

}

export const botOrchestrator = (): BotOrchestrator => BotOrchestrator.instance();
