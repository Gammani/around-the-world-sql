module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

/*
"jest": {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
      "rootDir": "src",
      "testRegex": ".*\\.spec\\.ts$",
      "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**!/!*.(t|j)s"
  ],
      "coverageDirectory": "../coverage",
      "testEnvironment": "node"
}*/
