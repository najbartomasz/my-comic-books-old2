import type { LogEntry } from 'log-entry';

export interface LogAppender {
    log: (logEntry: LogEntry) => void;
}
