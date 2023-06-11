
import type { LogAppender } from '../../src/log-appenders/log-appender.model';
import type { LoggerFactory } from '../../src/logger-factory.model';
import type { LoggerFactoryBuilder } from '../../src/logger-factory-builder.model';

import { LogFormat } from '../../src/log-appenders/log/log-format';
import { createLoggerFactoryBuilder } from '../../src/logger-factory-builder';
import * as consoleLogAppenderModule from '../../src/log-appenders/console-log-appender';
import * as httpLogAppenderModule from '../../src/log-appenders/http-log-appender';
import * as loggerFactoryModule from '../../src/logger-factory';

describe('logger-factory-builder', () => {
    let loggerFactoryBuilder: LoggerFactoryBuilder;

    let loggerFactoryMock: LoggerFactory;
    let createLoggerFactorySpy: jest.SpyInstance;

    beforeEach(() => {
        loggerFactoryBuilder = createLoggerFactoryBuilder();

        loggerFactoryMock = { createLogger: jest.fn() };
        createLoggerFactorySpy = jest.spyOn(loggerFactoryModule, 'createLoggerFactory').mockReturnValueOnce(loggerFactoryMock);
    });

    test('builds logger factroy with default pretty console logger', () => {
        // Given
        const consoleLogAppenderMock: LogAppender = { log: jest.fn() };
        const createConsoleLogAppenderSpy = jest.spyOn(consoleLogAppenderModule, 'createConsoleLogAppender')
            .mockReturnValueOnce(consoleLogAppenderMock);

        // When
        const builtLoggerFactory = loggerFactoryBuilder.build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith([consoleLogAppenderMock]);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledWith(LogFormat.Pretty);
    });

    test('builds logger factory with added pretty console logger', () => {
        // Given
        const consoleLogAppenderMock: LogAppender = { log: jest.fn() };
        const createConsoleLogAppenderSpy = jest.spyOn(consoleLogAppenderModule, 'createConsoleLogAppender')
            .mockReturnValueOnce(consoleLogAppenderMock);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addPrettyConsoleLogger()
            .build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith([consoleLogAppenderMock]);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledWith(LogFormat.Pretty);
    });

    test('builds logger factory with added json console logger', () => {
        // Given
        const consoleLogAppenderMock: LogAppender = { log: jest.fn() };
        const createConsoleLogAppenderSpy = jest.spyOn(consoleLogAppenderModule, 'createConsoleLogAppender')
            .mockReturnValueOnce(consoleLogAppenderMock);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addJsonConsoleLogger()
            .build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith([consoleLogAppenderMock]);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledWith(LogFormat.Json);
    });

    test('builds logger factory with the last added console logger when multiple console loggers were added', () => {
        // Given
        const consoleLogAppenderMock: LogAppender = { log: jest.fn() };
        const createConsoleLogAppenderSpy = jest.spyOn(consoleLogAppenderModule, 'createConsoleLogAppender')
            .mockReturnValueOnce(consoleLogAppenderMock);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addJsonConsoleLogger()
            .addPrettyConsoleLogger()
            .build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith([consoleLogAppenderMock]);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createConsoleLogAppenderSpy).toHaveBeenCalledWith(LogFormat.Pretty);
    });

    test('builds logger factory with added http logger containing default values', () => {
        // Given
        const httpLogAppenderMock: LogAppender = { log: jest.fn() };
        const createHttpLogAppenderSpy = jest.spyOn(httpLogAppenderModule, 'createHttpLogAppender')
            .mockReturnValueOnce(httpLogAppenderMock);
        const url = 'http://localhost:3000/v1/log';
        const defaultMaxLogBufferSizeInMb = 1;
        const defaultSendRetryTimer = 100;

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addHttpLogger(url)
            .build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith(expect.arrayContaining([httpLogAppenderMock]));
        expect(createHttpLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createHttpLogAppenderSpy).toHaveBeenCalledWith(url, defaultMaxLogBufferSizeInMb, defaultSendRetryTimer);
    });

    test('builds logger factory with added http logger', () => {
        // Given
        const httpLogAppenderMock: LogAppender = { log: jest.fn() };
        const createHttpLogAppenderSpy = jest.spyOn(httpLogAppenderModule, 'createHttpLogAppender')
            .mockReturnValueOnce(httpLogAppenderMock);
        const url = 'http://localhost:3000/v1/log';
        const maxLogBufferSizeInMb = 3;
        const sendRetryTimer = 50;
        const logFilename = 'log';

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addHttpLogger(url, maxLogBufferSizeInMb, sendRetryTimer, logFilename)
            .build();

        // Then
        expect(builtLoggerFactory).toStrictEqual(loggerFactoryMock);
        expect(createLoggerFactorySpy).toHaveBeenCalledTimes(1);
        expect(createLoggerFactorySpy).toHaveBeenCalledWith(expect.arrayContaining([httpLogAppenderMock]));
        expect(createHttpLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createHttpLogAppenderSpy).toHaveBeenCalledWith(url, maxLogBufferSizeInMb, sendRetryTimer);
    });
});
