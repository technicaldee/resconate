module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/**/*.test.js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/__tests__/components.test.js' // Skip component tests (requires React testing setup)
  ]
};

