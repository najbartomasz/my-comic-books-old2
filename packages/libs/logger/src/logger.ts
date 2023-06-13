import type { LogAppender } from './log-appenders/log-appender.model';
import type { LogEntry } from './log-appenders/log/log-entry.model';
import type { Logger } from './logger.model';

import { createErrorLogEntry, createInfoLogEntry, createWarnLogEntry } from './log-appenders/log/log-entry';

const setLogAppenders = (logAppenders: LogAppender[]): ((logEntry: LogEntry) => void) =>
    (logEntry: LogEntry): void => {
        logAppenders.forEach((logAppender): void => {
            logAppender.log(logEntry);
        });
    };

export const createLogger = (applicationName: string, label: string, logAppenders: LogAppender[]): Logger => {
    const log = setLogAppenders(logAppenders);
    return {
        info: (message: string): void => {
            log(createInfoLogEntry(applicationName, label, message));
        },
        warn: (message: string): void => {
            log(createWarnLogEntry(applicationName, label, message));
        },
        error: (message: string, error?: unknown): void => {
            log(createErrorLogEntry(applicationName, label, message, error));
        }
    };
};
