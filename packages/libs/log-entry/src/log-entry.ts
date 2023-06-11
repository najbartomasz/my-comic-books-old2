import type { LogEntry } from './log-entry.model';
import type { LogEntryError } from './log-entry-error.model';

import { LogLevel } from './log-level';

const createLogEntryError = (error: unknown): LogEntryError => {
    if (error instanceof Error) {
        const logEntryError: LogEntryError = { name: error.name, message: error.message };
        return (error.stack === undefined) ? { ...logEntryError } : { ...logEntryError, stack: error.stack };
    }
    return { name: 'UnknownErrorType', message: JSON.stringify(error) };
};

const createLogEntry = (logLevel: LogLevel, applicationName: string, loggerLabel: string, message: string, error?: unknown): LogEntry => {
    const logEntry: LogEntry = { timestamp: new Date(), applicationName, loggerLabel, logLevel, message };
    return (error === undefined) ? logEntry : { ...logEntry, error: createLogEntryError(error) };
};

export const createInfoLogEntry = (applicationName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Info, applicationName, loggerLabel, message);

export const createWarnLogEntry = (applicationName: string, loggerLabel: string, message: string): LogEntry =>
    createLogEntry(LogLevel.Warn, applicationName, loggerLabel, message);

export const createErrorLogEntry = (applicationName: string, loggerLabel: string, message: string, error?: unknown): LogEntry =>
    createLogEntry(LogLevel.Error, applicationName, loggerLabel, message, error);
