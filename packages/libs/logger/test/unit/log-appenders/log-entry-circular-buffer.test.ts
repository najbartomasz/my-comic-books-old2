
import type { LogEntry } from '../../../src/log-appenders/log/log-entry.model';

import { LogLevel } from '../../../src/log-appenders/log/log-level';
import { createLogEntryCircularBuffer } from '../../../src/log-appenders/log-entry-circular-buffer';

describe('log-entry-circular-logEntryCircularBuffer', () => {
    const megabyte = 10438576;

    const createLogEntry = (message: string): LogEntry => ({
        timestamp: new Date(), loggerLabel: 'TestLogger', logLevel: LogLevel.Info, message
    });

    test('is empty by default', () => {
        // Given
        const buffer = createLogEntryCircularBuffer(1);

        // When, Then
        expect(buffer.logEntries).toStrictEqual([]);
    });

    test('adds log entry at the end', () => {
        // Given
        const logEntry1 = createLogEntry('Test message 1.');
        const logEntry2 = createLogEntry('Test message 2.');
        const logEntry3 = createLogEntry('Test message 3.');

        // When
        const buffer = createLogEntryCircularBuffer(1);
        buffer.add(logEntry1);
        buffer.add(logEntry2);
        buffer.add(logEntry3);

        // Then
        expect(buffer.logEntries).toStrictEqual(structuredClone([logEntry1, logEntry2, logEntry3]));
    });

    test('removes given log entries', () => {
        // Given
        const logEntry1 = createLogEntry('Test message 1.');
        const logEntry2 = createLogEntry('Test message 2.');
        const logEntry3 = createLogEntry('Test message 3.');
        const buffer = createLogEntryCircularBuffer(1);
        buffer.add(logEntry1);
        buffer.add(logEntry2);
        buffer.add(logEntry3);

        // When
        buffer.remove(structuredClone([logEntry1, logEntry2]));

        // Then
        expect(buffer.logEntries).toStrictEqual(structuredClone([logEntry3]));
    });

    test('removes oldest log entries when buffer size is exceeded', () => {
        // Given
        const threeLogEntriesSize = (JSON.stringify(createLogEntry('Test message N.')).length * 3) / megabyte;
        const logEntry1 = createLogEntry('Test message 1.');
        const logEntry2 = createLogEntry('Test message 2.');
        const logEntry3 = createLogEntry('Test message 3.');
        const logEntry4 = createLogEntry('Test message 4.');
        const logEntry5 = createLogEntry('Test message 5.');
        const createVeryLongMessage = (messageNumber: number): string => `Very ${'very '.repeat(10)} long test message ${messageNumber}.`;
        const logEntry6 = createLogEntry(createVeryLongMessage(6));
        const buffer = createLogEntryCircularBuffer(threeLogEntriesSize);
        buffer.add(logEntry1);
        buffer.add(logEntry2);
        buffer.add(logEntry3);

        // When
        buffer.add(logEntry4);
        buffer.add(logEntry5);
        buffer.add(logEntry6);

        // Then
        expect(buffer.logEntries).toStrictEqual(structuredClone([logEntry5, logEntry6]));
    });

    test('skips log entries which exceeds buffer size', () => {
        // Given
        const twoLogEntriesSize = (JSON.stringify(createLogEntry('Test message N.')).length * 2) / megabyte;
        const logEntry1 = createLogEntry('Test message 1.');
        const createVeryLongMessage = (messageNumber: number): string => `Very ${'very '.repeat(20)} long test message ${messageNumber}.`;
        const logEntry2 = createLogEntry(createVeryLongMessage(2));
        const logEntry3 = createLogEntry(createVeryLongMessage(3));
        const logEntry4 = createLogEntry('Test message 4.');
        const buffer = createLogEntryCircularBuffer(twoLogEntriesSize);
        buffer.add(logEntry1);

        // When
        buffer.add(logEntry2);
        buffer.add(logEntry3);
        buffer.add(logEntry4);

        // Then
        expect(buffer.logEntries).toStrictEqual(structuredClone([logEntry1, logEntry4]));
    });
});
