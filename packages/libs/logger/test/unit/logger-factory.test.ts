import type { LogAppender } from '../../src/log-appenders/log-appender.model';
import type { LogEntry } from '../../src/log-appenders/log-entry.model';
import type { LoggerFactory } from '../../src/logger-factory.model';

import { LogLevel } from '../../src/log-appenders/log-level';
import { createLoggerFactory } from '../../src/logger-factory';
import { utils } from '../../src/utils';

describe('logger-factory', () => {
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';
    const timestamp = new Date('1987-08-20T15:30:00');

    let loggerFactory: LoggerFactory;

    let logAppender1Mock: LogAppender;
    let logAppender2Mock: LogAppender;

    beforeEach(() => {
        jest.spyOn(utils, 'getCurrentDate').mockReturnValueOnce(timestamp);
        logAppender1Mock = { log: jest.fn() };
        logAppender2Mock = { log: jest.fn() };

        loggerFactory = createLoggerFactory([ logAppender1Mock, logAppender2Mock ]);
    });

    test('creates logger able to log info message', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };
        const logger = loggerFactory.createLogger(loggerLabel);

        // When
        logger.info(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('creates logger able to log warn message', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };
        const logger = loggerFactory.createLogger(loggerLabel);

        // When
        logger.warn(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('creates logger able to log error message without defined error', () => {
        // Given
        const expectedLogEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message };
        const logger = loggerFactory.createLogger(loggerLabel);

        // When
        logger.error(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('creates logger able to log error message with defined error', () => {
        // Given
        const error = new Error('Error message.');
        const expectedLogEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error };
        const logger = loggerFactory.createLogger(loggerLabel);

        // When
        logger.error(message, error);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });
});
