const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testMatch: ["**/__tests__/**/*.test.jsx", "**/__tests__/**/*.test.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};

module.exports = createJestConfig(customJestConfig);
