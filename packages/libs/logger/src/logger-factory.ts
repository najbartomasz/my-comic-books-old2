import type { LogAppender } from './log-appenders/log-appender.model';
import type { Logger } from './logger.model';
import type { LoggerFactory } from './logger-factory.model';

import { createLogger } from './logger';

export const createLoggerFactory = (applicationName: string, logAppenders: LogAppender[]): LoggerFactory => ({
    createLogger: (label: string): Logger => createLogger(applicationName, label, logAppenders)
});
