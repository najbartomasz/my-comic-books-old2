import type { LogAppender } from './log-appenders/log-appender.model';
import type { LoggerFactory } from './logger-factory.model';
import type { LoggerFactoryBuilder } from './logger-factory-builder.model';
import type { LoggerOptions } from './logger-options.model';

import { LogFormat } from './log-appenders/log/log-format';
import { createConsoleLogAppender } from './log-appenders/console-log-appender';
import { createHttpLogAppender } from './log-appenders/http-log-appender';
import { createLoggerFactory } from './logger-factory';

const createFactoryBuilder = (options: LoggerOptions): LoggerFactoryBuilder => ({
    addPrettyConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder({ ...options, logFormat: LogFormat.Pretty }),
    addJsonConsoleLogger: (): LoggerFactoryBuilder =>
        createFactoryBuilder({ ...options, logFormat: LogFormat.Json }),
    addHttpLogger: (url: string, maxLogBufferSizeInMb = 1, sendRetryTimer = 100): LoggerFactoryBuilder =>
        createFactoryBuilder({ ...options, httpServer: { url, maxLogBufferSizeInMb, sendRetryTimer } }),
    build: (): LoggerFactory => {
        const logAppenders: LogAppender[] = [
            createConsoleLogAppender(options.logFormat ?? LogFormat.Pretty)
        ];
        const { httpServer } = options;
        if (httpServer) {
            const { url, maxLogBufferSizeInMb, sendRetryTimer } = httpServer;
            logAppenders.push(createHttpLogAppender(url, maxLogBufferSizeInMb, sendRetryTimer));
        }
        return createLoggerFactory(logAppenders);
    }
});

export const createLoggerFactoryBuilder = (): LoggerFactoryBuilder => createFactoryBuilder({});
