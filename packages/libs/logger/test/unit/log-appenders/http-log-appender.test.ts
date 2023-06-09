import type { LogAppender } from '../../../src/log-appenders/log-appender.model';
import type { LogEntry } from '../../../src/log-appenders/log/log-entry.model';
import type { LogEntryError } from '../../../src/log-appenders/log/log-entry-error.model';

import { LogLevel } from '../../../src/log-appenders/log/log-level';
import { createHttpLogAppender } from '../../../src/log-appenders/http-log-appender';

describe('http-log-appender', () => {
    const url = 'http://localhost:3000/v1/log';
    const sendRetryTimer = 100;
    const headers = { 'Content-Type': 'application/json' }; // eslint-disable-line @typescript-eslint/naming-convention


    let httpLogAppender: LogAppender;

    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        const maxLogBufferSizeInMb = 1;
        httpLogAppender = createHttpLogAppender(url, maxLogBufferSizeInMb, sendRetryTimer);

        fetchSpy = jest.spyOn(global, 'fetch');
    });

    test('posts log', () => {
        // Given
        const logEntry = { timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Info, message: 'Test message.' };
        fetchSpy.mockResolvedValueOnce({});

        // When
        httpLogAppender.log(logEntry);

        // Then
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenNthCalledWith(
            1, url, { method: 'POST', headers, body: JSON.stringify({ logEntries: [logEntry] }) }
        );
    });

    test('adds error log entry and retries posting log when previous attempt failed', async () => {
        // Given
        const logEntry: LogEntry = { timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Info, message: 'Test message.' };
        const error = new Error('Test error.');
        error.stack = 'Test error stack';
        const logEntryError: LogEntryError = { name: error.name, message: error.message, stack: error.stack };
        const errorTime = new Date();
        jest.spyOn(global, 'Date').mockReturnValueOnce(errorTime);
        const expectedErrorLogEntry: LogEntry = {
            timestamp: errorTime, loggerLabel: 'HttpLogger', logLevel: LogLevel.Error, message: 'Failed to post logs.', error: logEntryError
        };
        fetchSpy
            .mockRejectedValueOnce(error)
            .mockResolvedValueOnce({});

        // When
        httpLogAppender.log(logEntry);
        await jest.advanceTimersByTimeAsync(sendRetryTimer);

        // Then
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(fetchSpy).toHaveBeenNthCalledWith(
            1, url, { method: 'POST', headers, body: JSON.stringify({ logEntries: [logEntry] }) }
        );
        expect(fetchSpy).toHaveBeenNthCalledWith(
            2, url, { method: 'POST', headers, body: JSON.stringify({ logEntries: [logEntry, expectedErrorLogEntry] }) }
        );
    });


    test('posts logs that occured while waiting for previous post response', async () => {
        // Given
        const logEntry1 = { timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Info, message: 'Test message 1.' };
        const logEntry2 = { timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Warn, message: 'Test message 2.' };
        const logEntry3 = { timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Info, message: 'Test message 3.' };
        fetchSpy
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        // When
        httpLogAppender.log(logEntry1);
        httpLogAppender.log(logEntry2);
        httpLogAppender.log(logEntry3);
        await jest.advanceTimersToNextTimerAsync();

        // Then
        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(fetchSpy).toHaveBeenNthCalledWith(
            1, url, { method: 'POST', headers, body: JSON.stringify({ logEntries: [logEntry1] }) }
        );
        expect(fetchSpy).toHaveBeenNthCalledWith(
            2, url, { method: 'POST', headers, body: JSON.stringify({ logEntries: [logEntry2, logEntry3] }) }
        );
    });
});
