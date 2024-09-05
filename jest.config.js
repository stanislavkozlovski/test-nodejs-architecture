process.env = Object.assign(process.env, {
  DISABLE_LOGGER: "true",
  ENV: "test",
});

module.exports = {
  verbose: true,
  moduleFileExtensions: ["ts", "js"],
  rootDir: ".",
  preset: "ts-jest",
  testRegex: "\\.spec\\.ts$",
  testEnvironment: "node",
  forceExit: true,
  resetMocks: true,
  globalSetup: "<rootDir>/src/database/db-test.setup.ts",
  globalTeardown: "<rootDir>/src/database/db-test.teardown.ts",
};
