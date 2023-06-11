import type { LogAppender } from '../../src/log-appenders/log-appender.model';
import type { Logger } from '../../src/logger.model';

import { createLogger } from '../../src/logger';

import { createErrorLogEntry, createInfoLogEntry, createWarnLogEntry } from 'log-entry';

describe('logger', () => {
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';
    const timestamp = new Date('1987-08-20T15:30:00');

    let logger: Logger;

    let logAppender1Mock: LogAppender;
    let logAppender2Mock: LogAppender;

    beforeEach(() => {
        jest.spyOn(global, 'Date').mockReturnValue(timestamp);
        logAppender1Mock = { log: jest.fn() };
        logAppender2Mock = { log: jest.fn() };

        logger = createLogger(loggerLabel, [logAppender1Mock, logAppender2Mock]);
    });


    test('logs info message', () => {
        // Given
        const expectedLogEntry = createInfoLogEntry(loggerLabel, message);

        // When
        logger.info(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('logs warn message', () => {
        // Given
        const expectedLogEntry = createWarnLogEntry(loggerLabel, message);

        // When
        logger.warn(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('logs error message without defined error', () => {
        // Given
        const expectedLogEntry = createErrorLogEntry(loggerLabel, message);

        // When
        logger.error(message);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });

    test('logs error message with defined error', () => {
        // Given
        const error = new Error('Test error message.');
        error.stack = 'Test error stack';
        const expectedLogEntry = createErrorLogEntry(loggerLabel, message, error);

        // When
        logger.error(message, error);

        // Then
        expect(logAppender1Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender1Mock.log).toHaveBeenCalledWith(expectedLogEntry);
        expect(logAppender2Mock.log).toHaveBeenCalledTimes(1);
        expect(logAppender2Mock.log).toHaveBeenCalledWith(expectedLogEntry);
    });
});
