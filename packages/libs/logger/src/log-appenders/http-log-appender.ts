import type { LogAppender } from './log-appender.model';
import type { LogEntry } from 'log-entry';

import { createLogEntryCircularBuffer } from './log-entry-circular-buffer';

import { createErrorLogEntry } from 'log-entry';

export const createHttpLogAppender = (
    applicationName: string, url: string, maxLogBufferSizeInMb: number, sendRetryTimer: number
): LogAppender => {
    const logBuffer = createLogEntryCircularBuffer(maxLogBufferSizeInMb);

    const postLogs = (logEntries: LogEntry[]): void => {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ logEntries }) })
            .then((): void => {
                logBuffer.remove(logEntries);
                if (logBuffer.logEntries.length) {
                    postLogs(logBuffer.logEntries);
                }
            })
            .catch((error: Error): void => {
                logBuffer.add(createErrorLogEntry(applicationName, 'HttpLogger', 'Failed to post logs.', error));
                setTimeout((): void => {
                    postLogs(logBuffer.logEntries);
                }, sendRetryTimer);
            });
    };

    return {
        log: (logEntry: LogEntry): void => {
            if (logBuffer.logEntries.length) {
                logBuffer.add(logEntry);
            } else {
                logBuffer.add(logEntry);
                postLogs(logBuffer.logEntries);
            }
        }
    };
};
