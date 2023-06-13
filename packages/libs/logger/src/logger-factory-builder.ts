import type { LogAppender } from './log-appenders/log-appender.model';
import type { LoggerFactory } from './logger-factory.model';
import type { LoggerFactoryBuilder } from './logger-factory-builder.model';
import type { LoggerOptions } from './logger-options.model';

import { LogFormat } from './log-appenders/log/log-format';
import { createConsoleLogAppender } from './log-appenders/console-log-appender';
import { createHttpLogAppender } from './log-appenders/http-log-appender';
import { createLoggerFactory } from './logger-factory';

const createLogAppenders = (appName: string, { logFormat, httpServer }: LoggerOptions): LogAppender[] => {
    const consoleLogAppender = createConsoleLogAppender(logFormat ?? LogFormat.Pretty);
    return (httpServer)
        ? [consoleLogAppender, createHttpLogAppender(appName, httpServer.url, httpServer.maxLogBufferSizeInMb, httpServer.sendRetryTimer)]
        : [consoleLogAppender];
};

const createFactoryBuilder = (appName: string, loggerOptions: LoggerOptions): LoggerFactoryBuilder => ({
    addPrettyConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder(appName, { ...loggerOptions, logFormat: LogFormat.Pretty }),
    addJsonConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder(appName, { ...loggerOptions, logFormat: LogFormat.Json }),
    addHttpLogger: (url: string, maxLogBufferSizeInMb = 1, sendRetryTimer = 100): LoggerFactoryBuilder =>
        createFactoryBuilder(appName, { ...loggerOptions, httpServer: { url, maxLogBufferSizeInMb, sendRetryTimer } }),
    build: (): LoggerFactory => createLoggerFactory(appName, createLogAppenders(appName, loggerOptions))
});

export const createLoggerFactoryBuilder = (appName: string): LoggerFactoryBuilder => createFactoryBuilder(appName, {});
