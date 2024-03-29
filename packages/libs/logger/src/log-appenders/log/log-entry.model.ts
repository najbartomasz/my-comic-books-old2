import type { LogEntryError } from './log-entry-error.model';
import type { LogLevel } from './log-level';

export interface LogEntry {
    timestamp: Date;
    appName: string;
    loggerLabel: string;
    logLevel: LogLevel;
    message: string;
    error?: LogEntryError;
}
