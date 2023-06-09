import type { LogFormat } from './log-appenders/log/log-format';

export interface LoggerOptions {
    logFormat?: LogFormat;
    httpServer?: {
        url: string;
        maxLogBufferSizeInMb: number;
        sendRetryTimer: number;
    };
}
