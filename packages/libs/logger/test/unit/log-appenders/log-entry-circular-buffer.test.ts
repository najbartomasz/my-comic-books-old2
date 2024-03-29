import { createInfoLogEntry } from '../../../src/log-appenders/log/log-entry';
import { createLogEntryCircularBuffer } from '../../../src/log-appenders/log-entry-circular-buffer';

describe('log-entry-circular-logEntryCircularBuffer', () => {
    const appName = 'Test';
    const loggerLabel = 'TestLogger';
    const megabyte = 10438576;

    test('is empty by default', () => {
        // Given
        const buffer = createLogEntryCircularBuffer(1);

        // When, Then
        expect(buffer.logEntries).toStrictEqual([]);
    });

    test('adds log entry at the end', () => {
        // Given
        const logEntry1 = createInfoLogEntry(appName, loggerLabel, 'Test message 1.');
        const logEntry2 = createInfoLogEntry(appName, loggerLabel, 'Test message 2.');
        const logEntry3 = createInfoLogEntry(appName, loggerLabel, 'Test message 3.');

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
        const logEntry1 = createInfoLogEntry(appName, loggerLabel, 'Test message 1.');
        const logEntry2 = createInfoLogEntry(appName, loggerLabel, 'Test message 2.');
        const logEntry3 = createInfoLogEntry(appName, loggerLabel, 'Test message 3.');
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
        const threeLogEntriesSize = (JSON.stringify(createInfoLogEntry(appName, loggerLabel, 'Test message N.')).length * 3) + 1;
        const logEntry1 = createInfoLogEntry(appName, loggerLabel, 'Test message 1.');
        const logEntry2 = createInfoLogEntry(appName, loggerLabel, 'Test message 2.');
        const logEntry3 = createInfoLogEntry(appName, loggerLabel, 'Test message 3.');
        const logEntry4 = createInfoLogEntry(appName, loggerLabel, 'Test message 5.');
        const logEntry5 = createInfoLogEntry(appName, loggerLabel, 'Test message 5.');
        const createVeryLongMessage = (messageNumber: number): string => `Very ${'very '.repeat(10)} long test message ${messageNumber}.`;
        const logEntry6 = createInfoLogEntry(appName, loggerLabel, createVeryLongMessage(6));
        const buffer = createLogEntryCircularBuffer(threeLogEntriesSize / megabyte);
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
        const twoLogEntriesSize = (JSON.stringify(createInfoLogEntry(appName, loggerLabel, 'Test message N.')).length * 2) + 1;
        const logEntry1 = createInfoLogEntry(appName, loggerLabel, 'Test message 1.');
        const createVeryLongMessage = (messageNumber: number): string => `Very ${'very '.repeat(25)} long test message ${messageNumber}.`;
        const logEntry2 = createInfoLogEntry(appName, loggerLabel, createVeryLongMessage(2));
        const logEntry3 = createInfoLogEntry(appName, loggerLabel, createVeryLongMessage(3));
        const logEntry4 = createInfoLogEntry(appName, loggerLabel, 'Test message 4.');
        const buffer = createLogEntryCircularBuffer(twoLogEntriesSize / megabyte);
        buffer.add(logEntry1);

        // When
        buffer.add(logEntry2);
        buffer.add(logEntry3);
        buffer.add(logEntry4);

        // Then
        expect(buffer.logEntries).toStrictEqual(structuredClone([logEntry1, logEntry4]));
    });
});
