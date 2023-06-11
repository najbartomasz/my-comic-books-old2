import type { LogEntry } from 'log-entry';

export interface PrintableLogEntry extends Omit<LogEntry, 'timestamp' | 'logLevel'> {
    timestamp: string;
    logLevel: string;
}
