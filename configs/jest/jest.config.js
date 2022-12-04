'use strict';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts'
    ],
    coverageDirectory: 'coverage/',
    coverageReporters: [
        'lcov',
        'text'
    ],
    errorOnDeprecated: true,
    moduleDirectories: [
        'node_modules', 'src'
    ],
    resetMocks: true,
    resetModules: true,
    restoreMocks: true,
    roots: [
        'test'
    ],
    testMatch: [
        '**/*.test.ts'
    ],
    transform: {
        '^.+\\.(ts)$': [ 'ts-jest', { isolatedModules: true } ]
    },
    fakeTimers: {
        "enableGlobally": true
    },
    verbose: true
};
