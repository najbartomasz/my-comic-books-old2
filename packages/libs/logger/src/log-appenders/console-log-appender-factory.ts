import type { LogAppender } from './log-appender.model';
import type { LogAppenderFactory } from './log-appender-factory.model';
import type { LogEntry } from './log-entry.model';

import { ConsoleLogFormat } from './console-log-format';
import { LogLevel } from './log-level';

const logLevel = Object.freeze({
    [LogLevel.Info]: 'INFO',
    [LogLevel.Warn]: 'WARN',
    [LogLevel.Error]: 'ERROR'
});

const createMessage = (format: ConsoleLogFormat, logEntry: LogEntry): string => {
    const message = `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} ${logLevel[logEntry.logLevel]}: ${logEntry.message}`;

    if (format === ConsoleLogFormat.Pretty) {
        if (logEntry.error) {
            const errorDescription = `Caused by: ${logEntry.error.stack ?? logEntry.error.message}`;
            return `${message}\n${errorDescription}`;
        }
        return `${message}`;
    }
    return JSON.stringify(logEntry);
};

export const consoleLogAppenderFactory: LogAppenderFactory<ConsoleLogFormat> = {
    createLogAppender: (format: ConsoleLogFormat): LogAppender => ({
        log: (logEntry: LogEntry): void => {
            const message = createMessage(format, logEntry);
            switch (logEntry.logLevel) {
                case LogLevel.Info:
                    console.info(message); // eslint-disable-line no-console
                    break;
                case LogLevel.Warn:
                    console.warn(message); // eslint-disable-line no-console
                    break;
                default: // LogLevel.Error
                    console.error(message); // eslint-disable-line no-console
                    break;
            }
        }
    })
};
