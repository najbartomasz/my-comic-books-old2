import type { LoggerFactory } from './logger-factory.model';

export interface LoggerFactoryBuilder {
    addPrettyConsoleLogger: () => LoggerFactoryBuilder;
    addJsonConsoleLogger: () => LoggerFactoryBuilder;
    addHttpLogger: (url: string, maxLogBufferSizeInMb?: number, sendRetryTimer?: number, logFilename?: string) => LoggerFactoryBuilder;
    build: () => LoggerFactory;
}
