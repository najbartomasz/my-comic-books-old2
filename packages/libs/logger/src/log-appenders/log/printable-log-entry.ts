import type { LogEntry } from 'log-entry';
import type { PrintableLogEntry } from './printable-log-entry.model';

import { LogLevel } from 'log-entry';

const printableLogLevel = Object.freeze({
    [LogLevel.Info]: 'INFO',
    [LogLevel.Warn]: 'WARN',
    [LogLevel.Error]: 'ERROR'
});

export const createPrintableLogEntry = ({ timestamp, loggerLabel, logLevel, message, error }: LogEntry): Readonly<PrintableLogEntry> => {
    const printableLogEntry: PrintableLogEntry = {
        timestamp: timestamp.toJSON(), loggerLabel, logLevel: printableLogLevel[logLevel], message
    };
    return (error) ? { ...printableLogEntry, error } : { ...printableLogEntry };
};
