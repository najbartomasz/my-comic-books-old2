import type { LogEntry } from './log-entry.model';
import type { LogEntryError } from './log-entry-error.model';

import { LogLevel } from './log-level';

const createLogEntryError = (error: unknown): LogEntryError => {
    if (error instanceof Error) {
        return (error.stack === undefined)
            ? { name: error.name, message: error.message }
            : { name: error.name, message: error.message, stack: error.stack };
    }
    return { name: 'UnknownErrorType', message: JSON.stringify(error) };
};

const createLogEntry = (logLevel: LogLevel, appName: string, loggerLabel: string, message: string, error?: unknown): LogEntry => {
    const logEntry: LogEntry = { timestamp: new Date(), appName, loggerLabel, logLevel, message };
    return (error === undefined) ? logEntry : { ...logEntry, error: createLogEntryError(error) };
};

export const createInfoLogEntry = (appName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Info, appName, loggerLabel, message);

export const createWarnLogEntry = (appName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Warn, appName, loggerLabel, message);

export const createErrorLogEntry = (appName: string, loggerLabel: string, message: string, error?: unknown): LogEntry =>
    createLogEntry(LogLevel.Error, appName, loggerLabel, message, error);
