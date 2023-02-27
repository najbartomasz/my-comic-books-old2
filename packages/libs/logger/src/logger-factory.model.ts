import type { Logger } from './logger.model';

export interface LoggerFactory {
    createLogger: (label: string) => Logger;
}
