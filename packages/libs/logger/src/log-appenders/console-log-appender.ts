import type { LogAppender } from './log-appender.model';
import type { LogEntry } from './log/log-entry.model';
import type { PrintableLogEntry } from './log/printable-log-entry.model';

import { LogFormat } from './log/log-format';
import { LogLevel } from './log/log-level';

const createPrettyMessage = ({ timestamp, loggerLabel, logLevel, message, error }: PrintableLogEntry): string => {
    const prettyMessage = `[${timestamp}] ${loggerLabel} ${logLevel}: ${message}`;
    if (error) {
        const stack = (error.stack === undefined) ? '' : `\n${error.stack}`;
        return `${prettyMessage}\nCaused by: ${error.name} ${error.message}${stack}`;
    }
    return prettyMessage;
};

const createJsonMessage = (printableLogEntry: PrintableLogEntry): PrintableLogEntry => printableLogEntry;

export const createConsoleLogAppender = (
    logFormat: LogFormat, createPrintableLogEntry: (logEntry: LogEntry) => Readonly<PrintableLogEntry>
): LogAppender => {
    const createMessage = (logFormat === LogFormat.Pretty) ? createPrettyMessage : createJsonMessage;
    return {
        log: (logEntry: LogEntry): void => {
            const message = createMessage(createPrintableLogEntry(logEntry));
            if (logEntry.logLevel === LogLevel.Info) {
                console.info(message); // eslint-disable-line no-console
            } else if (logEntry.logLevel === LogLevel.Warn) {
                console.warn(message); // eslint-disable-line no-console
            } else {
                console.error(message); // eslint-disable-line no-console
            }
        }
    };
};
