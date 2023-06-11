import type { PrintableLogEntry } from '../../../../src/log-appenders/log/printable-log-entry.model';

import { createPrintableLogEntry } from '../../../../src/log-appenders/log/printable-log-entry';

import { createErrorLogEntry, createInfoLogEntry, createWarnLogEntry } from 'log-entry';


describe('printable-log-entry', () => {
    const timestamp = new Date('1987-08-20T15:30:00');
    const loggerLabel = 'TestLogger';
    const message = 'Test message.';

    beforeEach(() => {
        jest.spyOn(global, 'Date').mockReturnValueOnce(timestamp);
    });

    test('creates info log entry', () => {
        // Given
        const logEntry = createInfoLogEntry(loggerLabel, message);
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'INFO', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info warn entry', () => {
        // Given
        const logEntry = createWarnLogEntry(loggerLabel, message);
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'WARN', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info log entry without error', () => {
        // Given
        const logEntry = createErrorLogEntry(loggerLabel, message);
        const expectedPrintableLogEntry: PrintableLogEntry = { timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'ERROR', message };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });

    test('creates info log entry with error', () => {
        // Given
        const error = new Error('Test error message.');
        error.stack = 'Test error stack';
        const logEntry = createErrorLogEntry(loggerLabel, message, error);
        const logEntryError = { name: error.name, message: error.message, stack: error.stack };
        const expectedPrintableLogEntry: PrintableLogEntry = {
            timestamp: timestamp.toJSON(), loggerLabel, logLevel: 'ERROR', message, error: logEntryError
        };

        // When
        const createdPrintableLogEntry = createPrintableLogEntry(logEntry);

        // Then
        expect(createdPrintableLogEntry).toStrictEqual(expectedPrintableLogEntry);
    });
});
