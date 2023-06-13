import type { LogEntry } from './log-entry.model';
import type { LogEntryError } from './log-entry-error.model';

import { LogLevel } from './log-level';

const createLogEntryError = (error: unknown): LogEntryError => (
    (error instanceof Error)
        ? { name: error.name, message: error.message, ...error.stack && { stack: error.stack } }
        : { name: 'UnknownErrorType', message: JSON.stringify(error) }
);

const createLogEntry = (logLevel: LogLevel, appName: string, loggerLabel: string, message: string, error?: unknown): LogEntry => ({
    timestamp: new Date(), appName, loggerLabel, logLevel, message, ...Boolean(error) && { error: createLogEntryError(error) }
});
// {

//     const logEntry: LogEntry = { timestamp: new Date(), appName, loggerLabel, logLevel, message };
//     return (error === undefined) ? logEntry : { ...logEntry, error: createLogEntryError(error) };
// };

export const createInfoLogEntry = (appName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Info, appName, loggerLabel, message);

export const createWarnLogEntry = (appName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Warn, appName, loggerLabel, message);

export const createErrorLogEntry = (appName: string, loggerLabel: string, message: string, error?: unknown): LogEntry =>
    createLogEntry(LogLevel.Error, appName, loggerLabel, message, error);
