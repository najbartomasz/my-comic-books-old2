import type { LogAppender } from './log-appenders/log-appender.model';
import type { LogEntry } from './log-appenders/log-entry.model';
import type { Logger } from './logger.model';
import type { LoggerFactory } from './logger-factory.model';

import { LogLevel } from './log-appenders/log-level';
import { utils } from './utils';

type LogMessageFunction = (loggerLabel: string, logLevel: LogLevel, message: string, error?: Error) => void;

const applyLogAppenders = (logAppenders: LogAppender[]): LogMessageFunction => (
    (loggerLabel: string, logLevel: LogLevel, message: string, error?: Error): void => {
        const timestamp = utils.getCurrentDate();
        const logEntry: LogEntry = (error)
            ? { timestamp, loggerLabel, logLevel, message, error }
            : { timestamp, loggerLabel, logLevel, message };

        logAppenders.forEach((logAppender): void => {
            logAppender.log(logEntry);
        });
    }
);

export const createLoggerFactory = (logAppenders: LogAppender[]): LoggerFactory => {
    const logMessage = applyLogAppenders(logAppenders);

    return {
        createLogger: (label: string): Logger => ({
            info: (message: string): void => {
                logMessage(label, LogLevel.Info, message);
            },
            warn: (message: string): void => {
                logMessage(label, LogLevel.Warn, message);
            },
            error: (message: string, error?: Error): void => {
                logMessage(label, LogLevel.Error, message, error);
            }
        })
    };
};
