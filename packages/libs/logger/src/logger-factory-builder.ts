import type { LogAppender } from './log-appenders/log-appender.model';
import type { LoggerFactory } from './logger-factory.model';
import type { LoggerFactoryBuilder } from './logger-factory-builder.model';
import type { LoggerOptions } from './logger-options.model';

import { LogFormat } from './log-appenders/log/log-format';
import { createConsoleLogAppender } from './log-appenders/console-log-appender';
import { createHttpLogAppender } from './log-appenders/http-log-appender';
import { createLoggerFactory } from './logger-factory';

const createFactoryBuilder = (applicationName: string, loggerOptions: LoggerOptions): LoggerFactoryBuilder => ({
    addPrettyConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder(applicationName, { ...loggerOptions, logFormat: LogFormat.Pretty }),
    addJsonConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder(applicationName, { ...loggerOptions, logFormat: LogFormat.Json }),
    addHttpLogger: (url: string, maxLogBufferSizeInMb = 1, sendRetryTimer = 100): LoggerFactoryBuilder =>
        createFactoryBuilder(applicationName, { ...loggerOptions, httpServer: { url, maxLogBufferSizeInMb, sendRetryTimer } }),
    build: (): LoggerFactory => {
        const logAppenders: LogAppender[] = [
            createConsoleLogAppender(loggerOptions.logFormat ?? LogFormat.Pretty)
        ];
        const { httpServer } = loggerOptions;
        if (httpServer) {
            const { url, maxLogBufferSizeInMb, sendRetryTimer } = httpServer;
            logAppenders.push(createHttpLogAppender(applicationName, url, maxLogBufferSizeInMb, sendRetryTimer));
        }
        return createLoggerFactory(applicationName, logAppenders);
    }
});

export const createLoggerFactoryBuilder = (applicationName: string): LoggerFactoryBuilder => createFactoryBuilder(applicationName, {});
