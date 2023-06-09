import type { LogEntry } from '../../../../src/log-appenders/log/log-entry.model';
import type { LogEntryError } from '../../../../src/log-appenders/log/log-entry-error.model';
import type { PrintableLogEntry } from '../../../../src/log-appenders/log/printable-log-entry.model';

import { LogLevel } from '../../../../src/log-appenders/log/log-level';
import { createPrintableLogEntry } from '../../../../src/log-appenders/log/printable-log-entry';

describe('printable-log-entry', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    test('creates info log entry', () => {
        // Given
        const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Info, message };
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'INFO', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info warn entry', () => {
        // Given
        const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Warn, message };
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'WARN', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info log entry without error', () => {
        // Given
        const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message };
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'ERROR', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info log entry with error', () => {
        // Given
        const logEntryError: LogEntryError = { name: 'TestError', message: 'Test error message.', stack: 'Test error stack' };
        const logEntry: LogEntry = { timestamp, loggerLabel, logLevel: LogLevel.Error, message, error: logEntryError };
        const expectedPrintableLogEntry: PrintableLogEntry = {
            timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'ERROR', message, error: logEntryError
        };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });
});
