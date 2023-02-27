import type { LogLevel } from './log-level';

export interface LogEntry {
    timestamp: Date;
    loggerLabel: string;
    logLevel: LogLevel;
    message: string;
    error?: Error;
}
