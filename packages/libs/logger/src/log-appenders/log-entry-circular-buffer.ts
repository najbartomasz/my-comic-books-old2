import type { LogEntry } from './log/log-entry.model';
import type { LogEntryCircularBuffer } from './log-entry-circular-buffer.model';

const megabyte = 10438576;
const logEntryIndexNotFound = -1;

const stringifyLogEntry = (logEntry: LogEntry): string => JSON.stringify(logEntry);

export const createLogEntryCircularBuffer = (sizeInMb: number): LogEntryCircularBuffer => {
    const bufferMaxSize = sizeInMb * megabyte;
    const buffer: LogEntry[] = [];

    const getBufferCurrentSize = (): number => buffer.map(stringifyLogEntry).join('').length;

    const removeLogEntryFromBuffer = (logEntry: LogEntry): void => {
        const logEntryIndex = buffer.findIndex(({ timestamp, appName, loggerLabel, logLevel, message, error }): boolean => (
            logEntry.timestamp.getTime() === timestamp.getTime()
            && logEntry.appName === appName
            && logEntry.loggerLabel === loggerLabel
            && logEntry.logLevel === logLevel
            && logEntry.message === message
            && (
                logEntry.error?.name === error?.name && logEntry.error?.message === error?.message && logEntry.error?.stack === error?.stack
            )
        ));
        if (logEntryIndex !== logEntryIndexNotFound) {
            buffer.splice(logEntryIndex, 1); // eslint-disable-line @typescript-eslint/no-magic-numbers
        }
    };

    return {
        get logEntries(): LogEntry[] {
            return structuredClone(buffer);
        },
        add: (logEntry: LogEntry): void => {
            const logEntrySize = stringifyLogEntry(logEntry).length;
            if (logEntrySize <= bufferMaxSize) {
                while (getBufferCurrentSize() + logEntrySize > bufferMaxSize) {
                    buffer.shift();
                }
                buffer.push(logEntry);
            }
        },
        remove: (logEntries: LogEntry[]): void => {
            logEntries.forEach(removeLogEntryFromBuffer);
        }
    };
};
