import type { LogEntry } from './log-entry.model';
import type { PrintableLogEntry } from './printable-log-entry.model';

import { LogLevel } from './log-level';

const printableLogLevel = Object.freeze({
    [LogLevel.Info]: 'INFO',
    [LogLevel.Warn]: 'WARN',
    [LogLevel.Error]: 'ERROR'
});

export const createPrintableLogEntry = ({ timestamp, appName, loggerLabel, logLevel, message, error }: LogEntry): PrintableLogEntry => ({
    timestamp: timestamp.toJSON(), appName, loggerLabel, logLevel: printableLogLevel[logLevel], message, ...error && { error }
});
