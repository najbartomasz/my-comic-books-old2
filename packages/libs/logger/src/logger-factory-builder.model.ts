import type { LoggerFactory } from './logger-factory.model';

export interface LoggerFactoryBuilder {
    addPrettyConsoleLogger: () => LoggerFactoryBuilder;
    addJsonConsoleLogger: () => LoggerFactoryBuilder;
    build: () => LoggerFactory;
}
