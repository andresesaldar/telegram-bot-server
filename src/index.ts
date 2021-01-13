import {cleanupManager, logger} from "./utils";
import {botOrchestrator} from "./core";

const componentName = "index"

logger.debug(componentName, "debug mode on");
logger.other(componentName, "welcome", "welcome to the telegram bot server");

botOrchestrator().start().then(
    () => {
        cleanupManager().addAsyncCleanupAction(
            (exitCode, signal) => {
                return Promise.resolve(
                    botOrchestrator().stop(signal ? signal : undefined)
                )
            }
        )
    }
)
