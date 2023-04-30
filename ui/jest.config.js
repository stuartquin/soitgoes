/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "components/(.*)": "<rootDir>/src/components/$1",
    "api/(.*)": "<rootDir>/src/api/$1",
    api: "<rootDir>/src/api",
    apiClient: "<rootDir>/src/apiClient",
    typeHelpers: "<rootDir>/src/typeHelpers",
    currency: "<rootDir>/src/currency",
    invoices: "<rootDir>/src/invoices",
  },
};
