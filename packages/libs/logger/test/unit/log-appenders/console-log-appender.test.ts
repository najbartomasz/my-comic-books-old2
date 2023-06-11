import type { LogAppender } from '../../../src/log-appenders/log-appender.model';
import type { PrintableLogEntry } from '../../../src/log-appenders/log/printable-log-entry.model';

import { LogFormat } from '../../../src/log-appenders/log/log-format';
import { createConsoleLogAppender } from '../../../src/log-appenders/console-log-appender';

import { createErrorLogEntry, createInfoLogEntry, createWarnLogEntry } from 'log-entry';

describe('console-log-appender', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    let consoleLogAppender: LogAppender;

    beforeEach(() => {
        jest.spyOn(global, 'Date').mockReturnValueOnce(timestamp);
    });

    describe('pretty', () => {
        beforeEach(() => {
            consoleLogAppender = createConsoleLogAppender(LogFormat.Pretty);
        });

        test('logs message to console info', () => {
            // Given
            const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementationOnce(jest.fn());
            const logEntry = createInfoLogEntry(loggerLabel, message);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger INFO: Test message.');
        });

        test('logs message to console warn', () => {
            // Given
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());
            const logEntry = createWarnLogEntry(loggerLabel, message);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger WARN: Test message.');
        });

        test('logs message to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const logEntry = createErrorLogEntry(loggerLabel, message);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.');
        });

        test('logs message with error description to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const error = new Error('Test error message.');
            delete error.stack;
            const logEntry = createErrorLogEntry(loggerLabel, message, error);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.\nCaused by: Error Test error message.'
            );
        });

        test('logs message with error description and stack to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const error = new Error('Test error message.');
            error.stack = 'Test error stack.';
            const logEntry = createErrorLogEntry(loggerLabel, message, error);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.\nCaused by: Error Test error message.\nTest error stack.'
            );
        });
    });

    describe('json', () => {
        beforeEach(() => {
            consoleLogAppender = createConsoleLogAppender(LogFormat.Json);
        });

        test('logs message to console info', () => {
            // Given
            const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementationOnce(jest.fn());
            const logEntry = createInfoLogEntry(loggerLabel, message);
            const expectedPrintableLogEntry: PrintableLogEntry = { ...logEntry, timestamp: logEntry.timestamp.toJSON(), logLevel: 'INFO' };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });

        test('logs message to console warn', () => {
            // Given
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());
            const logEntry = createWarnLogEntry(loggerLabel, message);
            const expectedPrintableLogEntry: PrintableLogEntry = { ...logEntry, timestamp: logEntry.timestamp.toJSON(), logLevel: 'WARN' };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });

        test('logs message with error description to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const error = new Error('Test error message.');
            error.stack = 'Test error stack.';
            const logEntry = createErrorLogEntry(loggerLabel, message, error);
            const logEntryError = { name: error.name, message: error.message, stack: error.stack };
            const expectedPrintableLogEntry: PrintableLogEntry = {
                ...logEntry, timestamp: logEntry.timestamp.toJSON(), logLevel: 'ERROR', error: logEntryError
            };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });
    });
});
