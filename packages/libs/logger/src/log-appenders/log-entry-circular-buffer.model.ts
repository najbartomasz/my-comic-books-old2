import type { LogEntry } from 'log-entry';

export interface LogEntryCircularBuffer {
    logEntries: LogEntry[];
    add: (logEntry: LogEntry) => void;
    remove: (logEntries: LogEntry[]) => void;
}
