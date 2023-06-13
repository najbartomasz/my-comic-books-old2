import type { LogEntry } from './log/log-entry.model';

export interface LogAppender {
    log: (logEntry: LogEntry) => void;
}
