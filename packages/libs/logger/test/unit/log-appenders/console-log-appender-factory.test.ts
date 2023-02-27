import type { LogAppender } from '../../../src/log-appenders/log-appender.model';
import type { LogEntry } from '../../../src/log-appenders/log-entry.model';

import { ConsoleLogFormat } from '../../../src/log-appenders/console-log-format';
import { LogLevel } from '../../../src/log-appenders/log-level';
import { consoleLogAppenderFactory } from '../../../src/log-appenders/console-log-appender-factory';

describe('console-log-appender-factory', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    let consoleLogAppender: LogAppender;

    let consoleInfoSpy: jest.SpyInstance;
    let consoleWarnSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementationOnce(jest.fn());
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementationOnce(jest.fn());
    });

    describe('pretty', () => {
        beforeEach(() => {
            consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty);
        });

        test('logs message to console info', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenLastCalledWith(
                `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} INFO: ${logEntry.message}`
            );
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message to console warn', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenLastCalledWith(
                `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} WARN: ${logEntry.message}`
            );
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message to console error', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenLastCalledWith(
                `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} ERROR: ${logEntry.message}`
            );
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message with error description to console error', () => {
            // Given
            const error: Error = { name: 'TestError', message: 'Error message.' };
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenLastCalledWith(
                `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} ERROR: ${logEntry.message}\nCaused by: ${error.message}`
            );
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message with error stack to console error', () => {
            // Given
            const error = new Error('Error message.');
            error.stack = 'Error stack';
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenLastCalledWith(
                `[${logEntry.timestamp.toJSON()}] ${logEntry.loggerLabel} ERROR: ${logEntry.message}\nCaused by: ${error.stack}`
            );
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
        });
    });

    describe('json', () => {
        beforeEach(() => {
            consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Json);
        });

        test('logs message to console info', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
            expect(consoleInfoSpy).toHaveBeenLastCalledWith(JSON.stringify(logEntry));
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message to console warn', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
            expect(consoleWarnSpy).toHaveBeenLastCalledWith(JSON.stringify(logEntry));
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message to console error when error details are not provided', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenLastCalledWith(JSON.stringify(logEntry));
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
        });

        test('logs message with error description to console error', () => {
            // Given
            const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error: new Error('Error message.') };

            // When
            consoleLogAppender.log(logEntry);

            // Then
            expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorSpy).toHaveBeenLastCalledWith(JSON.stringify(logEntry));
            expect(consoleInfoSpy).toHaveBeenCalledTimes(0);
            expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
        });
    });
});
