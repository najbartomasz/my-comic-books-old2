
import type { LoggerFactory } from '../../src/logger-factory.model';

import { ConsoleLogFormat } from '../../src/log-appenders/console-log-format';
import { consoleLogAppenderFactory } from '../../src/log-appenders/console-log-appender-factory';
import { createLoggerFactory } from '../../src/logger-factory';
import { loggerFactoryBuilder } from '../../src/logger-factory-builder';

describe('logger-factory-builder', () => {
    const stringify = (key: string, value: unknown): string => (('function' === typeof value) ? value.toString() : value as string);

    test('builds logger factroy with default pretty console logger and prints warn message when no logger is explicitly added', () => {
        // Given
        const consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty);
        const createLogAppenderSpy = jest.spyOn(consoleLogAppenderFactory, 'createLogAppender');
        const expectedLoggerFactory: LoggerFactory = createLoggerFactory([ consoleLogAppender ]);
        const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());

        // When
        const builtLoggerFactory = loggerFactoryBuilder.build();

        // Then
        expect(JSON.stringify(builtLoggerFactory, stringify)).toStrictEqual(JSON.stringify(expectedLoggerFactory, stringify));
        expect(createLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createLogAppenderSpy).toHaveBeenCalledWith(ConsoleLogFormat.Pretty);
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('LoggerFactoryBuilder WARN: No logger were added. Adding Pretty Console Logger by default.')
        );
    });

    test(`builds logger factory with added pretty console logger`, () => {
        // Given
        const consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty);
        const createLogAppenderSpy = jest.spyOn(consoleLogAppenderFactory, 'createLogAppender');
        const expectedLoggerFactory: LoggerFactory = createLoggerFactory([ consoleLogAppender ]);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addPrettyConsoleLogger()
            .build();

        // Then
        expect(JSON.stringify(builtLoggerFactory, stringify)).toStrictEqual(JSON.stringify(expectedLoggerFactory, stringify));
        expect(createLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createLogAppenderSpy).toHaveBeenCalledWith(ConsoleLogFormat.Pretty);
    });

    test(`builds logger factory with added json console logger`, () => {
        // Given
        const consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Json);
        const createLogAppenderSpy = jest.spyOn(consoleLogAppenderFactory, 'createLogAppender');
        const expectedLoggerFactory: LoggerFactory = createLoggerFactory([ consoleLogAppender ]);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addJsonConsoleLogger()
            .build();

        // Then
        expect(JSON.stringify(builtLoggerFactory, stringify)).toStrictEqual(JSON.stringify(expectedLoggerFactory, stringify));
        expect(createLogAppenderSpy).toHaveBeenCalledTimes(1);
        expect(createLogAppenderSpy).toHaveBeenCalledWith(ConsoleLogFormat.Json);
    });

    test(`builds logger factory with the last added console logger when multiple console loggers where added`, () => {
        // Given
        const consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty);
        const createLogAppenderSpy = jest.spyOn(consoleLogAppenderFactory, 'createLogAppender');
        const expectedLoggerFactory: LoggerFactory = createLoggerFactory([ consoleLogAppender ]);

        // When
        const builtLoggerFactory = loggerFactoryBuilder
            .addJsonConsoleLogger()
            .addPrettyConsoleLogger()
            .build();

        // Then
        expect(JSON.stringify(builtLoggerFactory, stringify)).toStrictEqual(JSON.stringify(expectedLoggerFactory, stringify));
        expect(createLogAppenderSpy).toHaveBeenCalledTimes(2);
        expect(createLogAppenderSpy).toHaveBeenLastCalledWith(ConsoleLogFormat.Pretty);
    });
});
