import type { LogEntry } from '../../../../src/log-appenders/log/log-entry.model';
import type { LogEntryError } from '../../../../src/log-appenders/log/log-entry-error.model';

import { createErrorLogEntry, createInfoLogEntry, createWarnLogEntry } from '../../../../src/log-appenders/log/log-entry';
import { LogLevel } from '../../../../src/log-appenders/log/log-level';

describe('log-entry', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const appName = 'Test';
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    beforeEach(() => {
        jest.spyOn(global, 'Date').mockReturnValueOnce(timestamp);
    });

    test('creates info log entry', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, appName, loggerLabel, logLevel: LogLevel.Info, message };

        // When
        const createdLogEntry = createInfoLogEntry(appName, loggerLabel, message);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });

    test('creates warn log entry', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, appName, loggerLabel, logLevel: LogLevel.Warn, message };

        // When
        const createdLogEntry = createWarnLogEntry(appName, loggerLabel, message);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });

    test('creates error log entry without error defined', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, appName, loggerLabel, logLevel: LogLevel.Error, message };

        // When
        const createdLogEntry = createErrorLogEntry(appName, loggerLabel, message);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });

    test('creates error log entry with error defined but no stack', () => {
        // Given
        const error = new Error('Test error message.');
        delete error.stack;
        const expectedLogEntryError = { name: 'Error', message: 'Test error message.' };
        const expectedLogEntry: LogEntry = {
            timestamp, appName, loggerLabel, logLevel: LogLevel.Error, message, error: expectedLogEntryError
        };

        // When
        const createdLogEntry = createErrorLogEntry(appName, loggerLabel, message, error);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });

    test('creates error log entry with error defined', () => {
        // Given
        const error = new Error('Test error message.');
        error.stack = 'Test error stack';
        const expectedLogEntryError: LogEntryError = { name: 'Error', message: 'Test error message.', stack: 'Test error stack' };
        const expectedLogEntry: LogEntry = {
            timestamp, appName, loggerLabel, logLevel: LogLevel.Error, message, error: expectedLogEntryError
        };

        // When
        const createdLogEntry = createErrorLogEntry(appName, loggerLabel, message, error);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });

    test('creates error log entry with unknow error type', () => {
        // Given
        const error = 'Test unknown error';
        const expectedLogEntryError: LogEntryError = { name: 'UnknownErrorType', message: '"Test unknown error"' };
        const expectedLogEntry: LogEntry = {
            timestamp, appName, loggerLabel, logLevel: LogLevel.Error, message, error: expectedLogEntryError
        };

        // When
        const createdLogEntry = createErrorLogEntry(appName, loggerLabel, message, error);

        // Then
        expect(createdLogEntry).toStrictEqual(expectedLogEntry);
    });
});
