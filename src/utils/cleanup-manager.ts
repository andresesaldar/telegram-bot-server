import * as nodeCleanup from "node-cleanup";
import {logger} from "./logger";

const componentName = "PROCESS CLEANUP MANAGER"

export class CleanupManager {

    private processCleanupActions: number;
    private executedCleanupActions: number;
    private finishedCleanupActions: number;

    private static _instance: CleanupManager;

    public static instance(): CleanupManager {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        this.processCleanupActions = 0;
        this.executedCleanupActions = 0;
        this.finishedCleanupActions = 0;
    }

    public addAsyncCleanupAction(
        callback: (exitCode: number | null, signal: string | null) => Promise<any>
    ): void {
        nodeCleanup((exitCode: number | null, signal: string | null) => {
            if (signal) {
                callback(exitCode, signal).finally(() => {
                    this.evaluateFinish(signal);
                    this.finishedCleanupActions += 1;
                    logger.info(
                        componentName,
                        `Finished cleanup action. Total finished actions: ${
                            this.finishedCleanupActions
                        }`
                    )
                });
                if(this.executedCleanupActions === this.processCleanupActions - 1) {
                    nodeCleanup.uninstall();
                    return false;
                }
            }
            this.executedCleanupActions += 1;
            logger.debug(
                componentName,
                `Executed cleanup action. Total executed actions: ${
                    this.executedCleanupActions
                }`
            )
            logger.debug(
                componentName,
                `Executed cleanup action. Total executed actions: ${
                    this.executedCleanupActions
                }`
            )
        });
        this.processCleanupActions += 1;
        logger.info(
            componentName,
            `New cleanup action. Total cleanup actions: ${
                this.processCleanupActions
            }`
        )
    }

    private evaluateFinish(signal: string) {
        if(this.finishedCleanupActions === this.processCleanupActions - 1) {
            logger.other(
                componentName,
                "finish execution",
                `CLEANUP FINISHED. KILLING PROCESS`
            )
            process.kill(process.pid, signal)
        }
    }

}
