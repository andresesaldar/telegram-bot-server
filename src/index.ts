import {CleanupManager, logger} from "./utils";
import {BotOrchestrator} from "./core";

const componentName = "index"

logger.debug(componentName, "debug mode on");
logger.other(componentName, "welcome", "welcome to the telegram bot server");

BotOrchestrator.instance().start().then(
    () => CleanupManager.instance().addAsyncCleanupAction(
        (exitCode, signal) => {
            BotOrchestrator.instance().stop(signal ? signal : undefined)
            return Promise.resolve();
        }
    )
)
