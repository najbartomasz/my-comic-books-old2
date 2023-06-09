import type { LogAppender } from '../../src/log-appenders/log-appender.model';
import type { Logger } from '../../src/logger.model';
import type { LoggerFactory } from '../../src/logger-factory.model';

import { createLoggerFactory } from '../../src/logger-factory';
import * as loggerModule from '../../src/logger';

describe('logger-factory', () => {
    let loggerFactory: LoggerFactory;

    let logAppendersMock: LogAppender[];

    beforeEach(() => {
        logAppendersMock = [{ log: jest.fn() }, { log: jest.fn() }, { log: jest.fn() }];

        loggerFactory = createLoggerFactory(logAppendersMock);
    });

    test('creates logger', () => {
        // Given
        const loggerMock: Logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() };
        const createLoggerSpy = jest.spyOn(loggerModule, 'createLogger').mockReturnValueOnce(loggerMock);
        const loggerLabel = 'TestLogger';

        // When
        const createdLogger = loggerFactory.createLogger(loggerLabel);

        // Then
        expect(createdLogger).toStrictEqual(loggerMock);
        expect(createLoggerSpy).toHaveBeenCalledTimes(1);
        expect(createLoggerSpy).toHaveBeenCalledWith(loggerLabel, logAppendersMock);
    });
});
