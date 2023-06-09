import type { LogAppender } from '../../../src/log-appenders/log-appender.model';
import type { LogEntry } from '../../../src/log-appenders/log/log-entry.model';
import type { LogEntryError } from '../../../src/log-appenders/log/log-entry-error.model';
import type { PrintableLogEntry } from '../../../src/log-appenders/log/printable-log-entry.model';

import { LogFormat } from '../../../src/log-appenders/log/log-format';
import { LogLevel } from '../../../src/log-appenders/log/log-level';
import { createConsoleLogAppender } from '../../../src/log-appenders/console-log-appender';

describe('console-log-appender', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    let consoleLogAppender: LogAppender;

    let createPrintableLogEntryMock: jest.Mock;

    beforeEach(() => {
        createPrintableLogEntryMock = jest.fn();
    });

    describe('pretty', () => {
        beforeEach(() => {
            consoleLogAppender = createConsoleLogAppender(LogFormat.Pretty, createPrintableLogEntryMock);
        });

        test('logs message to console info', () => {
            // Given
            const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementationOnce(jest.fn());
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };
            createPrintableLogEntryMock.mockReturnValueOnce({ ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'INFO' });

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger INFO: Test message.');
        });

        test('logs message to console warn', () => {
            // Given
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };
            createPrintableLogEntryMock.mockReturnValueOnce({ ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'WARN' });

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger WARN: Test message.');
        });

        test('logs message to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message };
            createPrintableLogEntryMock.mockReturnValueOnce({ ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'ERROR' });

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith('[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.');
        });

        test('logs message with error description to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const logEntryError: LogEntryError = { name: 'TestError', message: 'Test error message.' };
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error: logEntryError };
            createPrintableLogEntryMock.mockReturnValueOnce({ ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'ERROR' });

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.\nCaused by: TestError Test error message.'
            );
        });

        test('logs message with error description and stack to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const logEntryError: LogEntryError = { name: 'TestError', message: 'Test error message.', stack: 'Test error stack' };
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error: logEntryError };
            createPrintableLogEntryMock.mockReturnValueOnce({ ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'ERROR' });

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                '[1987-08-20T13:30:00.000Z] TestLogger ERROR: Test message.\nCaused by: TestError Test error message.\nTest error stack'
            );
        });
    });

    describe('json', () => {
        beforeEach(() => {
            consoleLogAppender = createConsoleLogAppender(LogFormat.Json, createPrintableLogEntryMock);
        });

        test('logs message to console info', () => {
            // Given
            const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementationOnce(jest.fn());
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };
            const expectedPrintableLogEntry: PrintableLogEntry = { ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'INFO' };
            createPrintableLogEntryMock.mockReturnValueOnce(expectedPrintableLogEntry);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });

        test('logs message to console warn', () => {
            // Given
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };
            const expectedPrintableLogEntry: PrintableLogEntry = { ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'WARN' };
            createPrintableLogEntryMock.mockReturnValueOnce(expectedPrintableLogEntry);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });

        test('logs message with error description to console error', () => {
            // Given
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
            const logEntryError: LogEntryError = { name: 'TestError', message: 'Test error message.', stack: 'Test error stack' };
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error: logEntryError };
            const expectedPrintableLogEntry: PrintableLogEntry = { ...logEntry, timestamp: timestamp.toJSON(), logLevel: 'ERROR' };
            createPrintableLogEntryMock.mockReturnValueOnce(expectedPrintableLogEntry);

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenCalledWith(expectedPrintableLogEntry);
        });
    });
});
