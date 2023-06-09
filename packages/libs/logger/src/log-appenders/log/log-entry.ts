import type { LogEntry } from './log-entry.model';
import type { LogEntryError } from './log-entry-error.model';

import { LogLevel } from './log-level';

const createLogEntryError = (error: unknown): Readonly<LogEntryError> => {
    if (error instanceof Error) {
        const logEntryError: LogEntryError = { name: error.name, message: error.message };
        return (error.stack === undefined) ? { ...logEntryError } : { ...logEntryError, stack: error.stack };
    }
    return { name: 'UnknownErrorType', message: JSON.stringify(error) };
};

const createLogEntry = (logLevel: LogLevel, loggerLabel: string, message: string, error?: unknown): Readonly<LogEntry> => {
    const logEntry: LogEntry = { timestamp: new Date(), loggerLabel, logLevel, message };
    return (error === undefined) ? logEntry : { ...logEntry, error: createLogEntryError(error) };
};

export const createInfoLogEntry = (loggerLabel: string, message: string): Readonly<LogEntry> =>
    createLogEntry(LogLevel.Info, loggerLabel, message);

export const createWarnLogEntry = (loggerLabel: string, message: string): Readonly<LogEntry> =>
    createLogEntry(LogLevel.Warn, loggerLabel, message);

export const createErrorLogEntry = (loggerLabel: string, message: string, error?: unknown): Readonly<LogEntry> =>
    createLogEntry(LogLevel.Error, loggerLabel, message, error);
