import type { LogEntry } from './log/log-entry.model';

export interface LogEntryCircularBuffer {
    logEntries: LogEntry[];
    add: (logEntry: LogEntry) => void;
    remove: (logEntries: LogEntry[]) => void;
}
