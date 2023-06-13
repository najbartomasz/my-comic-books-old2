import type { LogEntry } from 'log-entry';
import type { PrintableLogEntry } from './printable-log-entry.model';

import { LogLevel } from 'log-entry';

const printableLogLevel = Object.freeze({
    [LogLevel.Info]: 'INFO',
    [LogLevel.Warn]: 'WARN',
    [LogLevel.Error]: 'ERROR'
});

export const createPrintableLogEntry = (logEntry: LogEntry): PrintableLogEntry => {
    const { timestamp, appName, loggerLabel, logLevel, message, error } = logEntry;
    const printableLogEntry: PrintableLogEntry = {
        timestamp: timestamp.toJSON(), appName, loggerLabel, logLevel: printableLogLevel[logLevel], message
    };
    return (error) ? { ...printableLogEntry, error } : { ...printableLogEntry };
};
