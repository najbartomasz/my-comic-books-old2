import type { LogAppender } from '../../../src/log-appenders/log-appender.model';

import { createHttpLogAppender } from '../../../src/log-appenders/http-log-appender';

import { createErrorLogEntry, createInfoLogEntry } from 'log-entry';

describe('http-log-appender', () => {
    const applicationName = 'Test';
    const url = 'http://localhost:3000/v1/log';
    const sendRetryTimer = 100;
    const headers = { 'Content-Type': 'application/json' }; // eslint-disable-line @typescript-eslint/naming-convention
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    let httpLogAppender: LogAppender;

    let fetchSpy: jest.SpyInstance;

    beforeEach(() => {
        const maxLogBufferSizeInMb = 1;
        httpLogAppender = createHttpLogAppender(applicationName, url, maxLogBufferSizeInMb, sendRetryTimer);

        fetchSpy = jest.spyOn(global, 'fetch');
    });

    test('posts log', () => {
        // Given
        const logEntry = createInfoLogEntry(applicationName, loggerLabel, message);
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
        const logEntry = createInfoLogEntry(applicationName, loggerLabel, message);
        const error = new Error('Test error.');
        error.stack = 'Test error stack';
        const errorTime = new Date();
        jest.spyOn(global, 'Date').mockReturnValue(errorTime);
        const expectedErrorLogEntry = createErrorLogEntry(applicationName, 'HttpLogger', 'Failed to post logs.', error);
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
        const logEntry1 = createInfoLogEntry(applicationName, loggerLabel, 'Test message 1.');
        const logEntry2 = createErrorLogEntry(applicationName, loggerLabel, 'Test message 2.');
        const logEntry3 = createInfoLogEntry(applicationName, loggerLabel, 'Test message 3.');
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
