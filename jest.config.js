/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  testRegex: '(src/__tests__/.*.test.*)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}

module.exports = config
