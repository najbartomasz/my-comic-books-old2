import type { LogEntry } from './log-entry.model';

export interface LogAppender {
    log: (logEntry: LogEntry) => void;
}
