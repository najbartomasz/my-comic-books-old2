import type { LogEntry } from './log-entry.model';

export interface PrintableLogEntry extends Omit<LogEntry, 'timestamp' | 'logLevel'> {
    timestamp: string;
    logLevel: string;
}
