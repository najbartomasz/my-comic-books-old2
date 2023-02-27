import type { LogAppender } from './log-appender.model';

export interface LogAppenderFactory<T> {
    createLogAppender: (options: T) => LogAppender;
}
