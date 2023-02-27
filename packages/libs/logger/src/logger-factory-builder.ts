import type { LogAppender } from './log-appenders/log-appender.model';
import type { LoggerFactory } from './logger-factory.model';
import type { LoggerFactoryBuilder } from './logger-factory-builder.model';

import { ConsoleLogFormat } from './log-appenders/console-log-format';
import { LogLevel } from './log-appenders/log-level';
import { consoleLogAppenderFactory } from './log-appenders/console-log-appender-factory';
import { createLoggerFactory } from './logger-factory';
import { utils } from './utils';

interface LoggerFactoryBuilderState {
    consoleLogAppender?: LogAppender;
}

const cloneState = (state: LoggerFactoryBuilderState): LoggerFactoryBuilderState => (
    JSON.parse(JSON.stringify(state)) as LoggerFactoryBuilderState
);

const createFactoryBuilder = (state: Readonly<LoggerFactoryBuilderState> = {}): LoggerFactoryBuilder => ({
    addPrettyConsoleLogger: (): LoggerFactoryBuilder => {
        const newState = {
            ...cloneState(state),
            consoleLogAppender: consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty)
        };

        return createFactoryBuilder(newState);
    },
    addJsonConsoleLogger: (): LoggerFactoryBuilder => {
        const newState = {
            ...cloneState(state),
            consoleLogAppender: consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Json)
        };

        return createFactoryBuilder(newState);
    },
    build: (): LoggerFactory => {
        const logAppenders = Object.values(state);
        if (logAppenders.length) {
            return createLoggerFactory(logAppenders);
        }

        const consoleLogAppender = consoleLogAppenderFactory.createLogAppender(ConsoleLogFormat.Pretty);
        const warnMessage = 'No logger were added. Adding Pretty Console Logger by default.';
        consoleLogAppender.log({
            timestamp: utils.getCurrentDate(), loggerLabel: 'LoggerFactoryBuilder', logLevel: LogLevel.Warn, message: warnMessage
        });
        return createLoggerFactory([ consoleLogAppender ]);
    }
});

export const loggerFactoryBuilder = createFactoryBuilder();
