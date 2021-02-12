module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '.git'],
  setupFiles: ['./tests/setup.js'],
  automock: false,
  modulePaths: ['<rootDir>']
};
